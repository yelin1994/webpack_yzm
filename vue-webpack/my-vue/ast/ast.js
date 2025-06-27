const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA',
}

const ElementTypes = {
  ELEMENT: 'ELEMENT',
  COMPONENT: 'COMPONENT',
}

function pares(str) {
  const context = {
    source: str, // 模板字符串
    mode: TextModes.DATA,
    advanceBy(n) {
      context.source = context.source.slice(n) // 根据给定的偏移量，截取模板字符串
    },
    advanceSpaces() {
      const match = /^[\t\r\n\f ]+/.exec(context.source) // 匹配模板字符串开头的空白字符
      if (match) {
        context.advanceBy(match[0].length) // 消费空白字符
      }
    }
  }
  const children = parseChildren(context, [])
  return {
    type: 'Root',
    children,
  }
}

function parseChildren(context, ancestors) {
  const nodes = []
  const { mode, source } = context
  while (!isEnd(context, ancestors)) {
    let node
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) { // 只有 DATA 和 RCDATA 模式才支持插值节点的解析
      if (mode === TextModes.DATA && source[0] === '<') { // 只有DATA 模式才支持标签节点的解析
        if (source[1] === '!') {
          if (source.startsWith('<!--')) { // 注释节点
            node = parseComment(context)
          } else if (source.startsWith('<![CDATA[')) {//  CADA
            node = parseCDATA(context)
          }
        } else if (source[1] === '/') { // 结束标签 需要抛出错误

        } else if (/[a-z]/i.test(source[1])) { // 标签
          node = parseElement(context, ancestors)
        }
      } else if (source.startsWith('{{')) { // 插值节点
        node = parseInterpolation(context) // 解析插槽
      }
    }
    if(!node) { // 如果节点不存在，则解析文本
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function isEnd(context, ancestors) {
  const s = context.source
  if(!s) return true
  const parent = ancestors[ancestors.length - 1] // 栈中 取开始节点
  if (parent && context.source.startsWith(`</${parent.tag}`)) {
    return true
  }
  return false
}

function parseElement(context, ancestors) {
  const element = parseTag(context) // 解析开始标签
  if (element.isSelfClosing) { // 自闭合标签 直接返回
    return element
  }
  if (element.tag === 'textarea' || element.tag === 'title') {
    context.mode = TextModes.RCDATA // 切换到 RCDATA 模式
  } else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
    context.mode = TextModes.RAWTEXT // 切换到 RAWTEXT 模式
  } else {
    context.mode = TextModes.CDATA // 切换到 CDATA 模式
  }
  ancestors.push(element)
  element.children = parseChildren(context, ancestors) // 解析子节点
  ancestors.pop()
  if (context.source.startsWith(`</${element.tag}`)) {
    parseTag(context, 'end')
  } else {
    throw new Error(`${element.tag} 标签缺少闭合标签`)
  }
  return element
}

function parseTag(context, type = 'start') {
  const { advanceBy, advanceSpaces } = context
  const match = type === 'start' 
    ? /^<([a-z][^\t\r\n\f />]*)/i.exec(context.source)
    : /^<\/([a-z][^\t\r\n\f />]*)/i.exec(context.source) // 匹配结束标签
  const tag = match[1]
  advanceBy(match[0].length)
  advanceSpaces()
  const props = parseAttributes(context)
  const isSelfClosing = context.source.startsWith('/>')
  advanceBy(isSelfClosing ? 2 : 1)
  return {
    type: ElementTypes.ELEMENT,
    tag,
    isSelfClosing,
    props,
    children: []
  }
}
//  <div id="foo" v-show="display"></div>
//
// 01 const ast = {
// 02   type: 'Root',
// 03   children: [
// 04     {
// 05       type: 'Element'
// 06       tag: 'div',
// 07       props: [
// 08         // 属性
// 09         { type: 'Attribute', name: 'id', value: 'foo' },
// 10         { type: 'Attribute', name: 'v-show', value: 'display' }
// 11       ]
// 12     }
// 13   ]
// 14 }
function parseAttributes(context) {
  const props = []
  while (!context.source.startsWith('>') && !context.source.startsWith('/>')) {
    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)
    const name = match[0]
    advanceBy(name.length)
    advanceSpaces()
    if (context.source[0] === '=') {
      advanceBy(1)
      advanceSpaces()
    }
    let value = ''
    const quote = context.source[0]
    const isQuoted = quote === '"' || quote === "'"
    if (isQuoted) {
      advanceBy(1)
      const endQuotedIndex = context.source.indexOf(quote)
      if (endQuotedIndex === -1) {
        throw new Error('缺少引号')
      }
      value = context.source.slice(0, endQuotedIndex)
      advanceBy(value.length)
    } else {
      const match = /^[^\t\r\n\f />]+/.exec(context.source) // 没有引号情况
      const value = match[0]
      advanceBy(value.length)
    }
    props.push({ type: 'Attribute', name, value })
  }
  return props
}

function parseText(context) {
  let endIndex = context.source.length
  let ltIndex = context.source.indexOf('<')
  let delimiterIndex = context.source.indexOf('{{')
  if(ltIndex > -1 && ltIndex < endIndex) {
    endIndex = ltIndex
  }
  if(delimiterIndex > -1 && delimiterIndex < endIndex) { // 插值节点
    endIndex = delimiterIndex
  }
  const content = context.source.slice(0, endIndex)
  context.advanceBy(content.length)
  return {
    type: 'Text',
    content
  }
}

function parseInterpolation(context) {
  context.advanceBy(2) // 消去 
  const closeIndex = context.source.indexOf('}}')
  if (closeIndex === -1) {
    throw new Error('缺少 }}')
  }
  const content = context.source.slice(0, closeIndex)
  context.advanceBy(content.length + 2) // 消费内容和 }}
  return {
    type: 'Interpolation',
    content: {
      type: 'Expression',
      content
    }
  }
}

function parseComment(context) {
  context.advanceBy(4) // 消费 <!-- 
  const closeIndex = context.source.indexOf('-->')
  const content = context.source.slice(0, closeIndex)
  context.advanceBy(content.length + 3) // 消费内容和 -->
  return {
    type: 'Comment',
    content
  }
}