import { reactive, effect } from './watch'

const Text = Symbol() // 标识文本节点
const Comment = Symbol() // 注释节点的type
const Fragment = Symbol() 

const queue = new Set() // 任务缓冲队列
let isFlushing = false // 是否正在刷新中
const p = Promise.resolve()

function  ququeJob() { // 调度器的主要函数 用来添加任务到缓冲队列中
  queue.add(job)
  if (!isFlushing) { // 当处于刷新中 则不执行
    isFlushing = true
    p.then(() => {
      try {
        p.forEach(job => job())
      } finally {
        isFlushing = false
        queue.clear()
      }
    })
  }
}

function createRenderer(options) {
  const {
    createElement,
    setElementText,
    insert,
    patchProps,
    createText,
    setText
  } = options
  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container)
    } else {
      // 说明是卸载操作
      if (container._vnode) {
        //  container.innnerHtml = ''
        // let el = container._vnode.el
        // let parent = el.parentNode
        // if (parent) parent.removeChild(el)
        unmount(container._vnode)
      }
     
    }
    container._vnode = vnode
  }
  function hydrate(vnode, container) {

  }


  function patch(oldnode, vnode, container, anchor) {
    if (oldnode && oldnode.type !== vnode.type) {
      //如果新旧node 的类型不一致 则将 旧node 卸载
      unmount(oldnode)
      oldnode = null
    }

    const { type } = vnode
    if (typeof type === 'string') { // 普通标签
      if (!oldnode) {
        mountElement(vnode, container, anchor)
      } else {
        patchElement(oldnode, vnode)
      }
    } else if (typeof type === 'object') { //自定义组件
      if (!oldnode) {
        mountComponent(vnode, container, anchor)
      } else {
        patchComponent(oldnode, vnode, anchor)
      }
    } else if (type === Text) {
      // 如果新的vnode 类型是Text 则说明是文本节点
      // 如果没有旧节点，则进行挂载
      if (!oldnode) {
        const el = vnode.el = createText(vnode.children)
        insert(el, container)
      } else {
        // 如果新旧节点存在 只需要使用新文本节点的文本内容更新旧文本节点
        const el = vnode.el = oldnode.el
        if (vnode.children !== oldnode.children) {
         setText(el, vnode.children)
        }
      }
    } else if (type === Comment) {
      if (!oldnode) {
        const el = vnode.el = document.createComment(vnode.children)
        insert(el, container)
      } else {
        const el = vnode.el = oldnode.el
        if (vnode.children !== oldnode.children) el.nodeValue = vnode.children
      }
    } else if (type === Fragment) { // 处理 Fragment 类型的 vnode 
      if (!oldnode) { // 旧节点不存在
        vnode.children.forEach(c => patch(null, c, container))
      } else {
        // 如果旧vnode 存在，则知足要更新Fragement 的 children
        patchChildren(oldnode, vnode, container)
      }
    }
   
  }

  /**
    const MyComponent = {
      name: 'MyComponnet',
      data() {
        return {
        }
      },
      render() {
        return { // 返回一个虚拟dom
          type: 'div',
          children: ''
        }
      }
    }

    const ComVNode = {
      type: MyCOmponent
    }
   */

  function mountComponent(vnode, container, anchor) {
    const componentOption = vnode.type // 获取组件的选项对象
    const { render, data } = componentOption // 获取组件的渲染方式
    const state = reactive(data())
    // 当组件自身状态发生变化时 能实现自更新
    effect(() => {
      const subTree = render.call(state, state) // render 会返回虚拟 DOM, 将this 设为 state
      patch(null, subTree, container, anchor)
    }, { sheduler: ququeJob })
  
  }

  function mountElement(vnode, container, anchor) {
    // vnode.el 指向 真实DOM元素
    const el = vnode.el =  createElement(vnode.type)
    if (vnode.props) {
      for (let key in vnode.props) {
         const value = vnode.props[key]
        // 用 in 来判断 是否存在对应的DOM Properties
        patchProps(el, key, null, value)
      }
    }
    if (typeof vnode.children === 'string') { // 如果子节点是文本节点
      // el.textContent = vnode.children
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }
    insert(vnode, container, anchor)
  }

  function unmount(vnode) {
    // Fragment 需要卸载children
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c))
      return
    }
    let parent = vnode.el.parentNode
    if (parent) parent.removeChild()
  }

  function patchComponent(oldnode, vnode, anchor) {

  }

  function patchElement(oldnode, vnode) {
    const el  = vnode.el = oldnode.el
    const oldProps = oldnode.props
    const newProps = vnode.props
    for (let key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }

    for (let key in oldProps) {
      if(!newProps[key]) {
        patchProps(el, key, oldProps[key], null)
      }
    }
    // 更新子节点
    patchChildren(oldnode, vnode, el)
  }

  function patchChildren(oldnode, vnode, el) {
    // 判断新子节点时文本节点
    if(typeof vnode.children === 'string') {
      // 旧节点 有三种子节点情况 没有子节点，子节点时文本节点、子节点时数组
      // 只有当子节点为一组节点的时候 才需要逐个卸载， 其他情况下什么都不需要做
      if (Array.isArray(oldnode.children)) {
        oldnode.children.forEach((c) => unmount(c))
      }
      setElementText(el, vnode.children)
    } else if (Array.isArray(n2.children)) { // 新子节点是一组子节点
      // 判断旧子节点是否也是一组子节点
      if (Array.isArray(oldnode.children)) {
        // 代码运行到这里，说明新旧节点都是一组子节点，这里设计核心的diff 算法
        // diffChildren1(oldnode, vnode, el)
        // const oldlen = oldchildren.length
        // const newLen = newchildren.length
        // const minLen = Math.min(oldlen, newLen)
        // for (let i = 0; i < minLen; i++) {
        //   // 调用patch 函数逐个更新字节点
        //   patch(oldchildren[i], newchildren[i])
        // }
        // if (newLen > oldlen) {
        //   for (let i = minLen; i < newLen; i++) {
        //     patch(null, newchildren[i], el)
        //   }
        // } else if (oldlen > newLen) {
        //   for (let i = minLen; i < oldlen; i++) {
        //     unmount(oldchildren[i])
        //   }
        // }
      } else {
        // 旧子节点是文本节点 或者不存在，
        setElementText(el, '')
        vnode.children.forEach(c => patch(null, c, el))
      }
    } else {
      // 新子节点不存在
      if (Array.isArray(oldnode.children)) {
        oldnode.children.forEach(c => unmount(c))
      } else if (typeof n1.children === 'string') {
        setElementText(el, '')
      }
    }
  }

  function diffChildren1(oldnode, vnode, el) {
    const oldchildren = oldnode.children
    const newchildren = vnode.children
    let lastIndex = 0 // 变量 lastIndex 始终存储着当前遇到的最大索引值
    for (let i = 0; i < newchildren.length; i++) {
      let j = 0
      for (; j < oldchildren.length; j++) {
        if (oldchildren[j].key === newchildren[i]) {
          patch(oldchildren[j], newchildren[i], el)
          if (j < lastIndex) { // 旧节点的索引小于上次匹配的节点索引 所以 要移动
            const prevnode = newchildren[i - 1]
            if (prevnode) { // 若不存在说明是第一个字节点
              const anchor = prevnode.el.nextSibling
              insert(newchildren[i].el, el, anchor)
            }
          } else {
            lastIndex = j
          }
          break
        }
      }
      if (j === oldchildren.length) { // 新增子节点
          const prevnode = newchildren[i - 1]
          let anchor
          if (prevnode) { // 若不存在说明是第一个字节点
            anchor = prevnode.el.nextSibling
          } else {
            anchor = el.firstChild
          }
          patch(null, newchildren[i], el, anchor)
      }
    }
    for (let i = 0; i < oldchildren.length; i++) {
      const has = newchildren.filter(item => item.key === oldchildren[i].key)
      if (!has) { // 待删除节点
        unmount(oldchildren[i])
      }
    }
  }

  function diffChildren2(oldnode, vnode, el) {
    const oldchildren = oldnode.children
    const newchildren = vnode.children
    // 四个索引值
    let oldStartIdx = 0
    let oldEndIdx = oldchildren.length - 1
    let newStartIdx = 0
    let newEndIdx = newchildren.length - 1
    let oldStartVNode = oldchildren[oldStartIdx]
    let oldEndVNode = oldchildren[oldEndIdx]
    let newStartVNode = newchildren[newStartIdx]
    let newEndVNode = newchildren[newEndIdx]
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (!oldStartVNode) {
        oldEndVNode = oldchildren[++oldEndIdx]
      } else if (!oldEndVNode) {
        oldEndVNode = oldchildren[--oldEndVNode]
      } else if (newStartVNode.key === oldStartVNode.key) {
        patch(oldStartVNode, newStartVNode, el)
        newStartVNode = newchildren[++newStartIdx]
        oldStartVNode = oldchildren[++oldStartIdx]
      } else if (newEndVNode.key === oldEndVNode.key) {
        patch(oldEndVNode, newEndVNode, el)
        newEndVNode = newchildren[--newEndIdx]
        oldEndVNode = oldchildren[--oldEndIdx]
      } else if (oldStartVNode.key === newEndVNode.key) {
        patch(oldStartVNode, newEndVNode, el)
        // 将旧的一组子节点的头部节点对应的真实 DOM 节点 oldStartVNode.el 移动到
        // 旧的一组子节点的尾部节点对应的真实 DOM 节点后面
        insert(oldStartVNode.el, el, oldEndVNode.el.nextSibling)
        oldStartVNode = oldchildren[++oldStartIdx]
        newEndVNode = newchildren[--newEndIdx]
      } else if (oldEndVNode.key === newStartVNode.key) {
        patch(oldEndVNode, newStartVNode, el)
        insert(oldEndVNode.el, el, oldStartVNode.el) // 插
        newStartVNode = newchildren[++newStartIdx]
        oldEndVNode = oldchildren[--oldEndIdx]
      } else {
        const oldIdx = oldchildren.findIndex(node => node.key === newStartVNode.key)
        if (oldEndIdx > 0) { // 存在可服用的节点
          let oldMovenode = oldchildren[oldIdx]
          patch(oldMovenode, newStartVNode, el)
          insert(oldEndVNode.el, el, oldStartVNode.el)
          oldchildren[oldIdx] = undefined
        } else { // 新增节点
          patch(null, newStartVNode, el, oldStartVNode.el)
        }
         newStartVNode = newchildren[++newStartIdx]
      }
    }
    if (oldStartIdx > oldEndIdx && newStartIdx <= newEndIdx) {
      for (let i = newStartIdx; i <= newEndIdx; i++) {
        patch(null, newchildren[i], el, oldStartVNode.el)
      }
    } else if (newStartIdx > newEndIdx && oldStartIdx <= oldEndIdx) {
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        unmount(oldchildren[i])
      }
    }
  }

  function diffChildren3(oldnode, vnode, el) {
    const oldchildren = oldnode.children
    const newchildren = vnode.children
    let j = 0
    let oldVnode = oldchildren[j]
    let newVnode = newchildren[j]
    // 从头开始比较
    while (oldVnode.key === newVnode.key && j < oldchildren.length && j < newchildren.length) {
      patch(oldVnode, newVnode, el)
      j++
      oldVnode = oldchildren[j]
      newVnode = newchildren[j]
    }
    if (j === oldchildren.length && j === newchildren.length) { // 新旧节点的顺序，key 都相同
      return
    }
    
    let oldEndIdx = oldchildren.length - 1
    let oldEndVnode = oldchildren[oldEndIdx]
    let newEndIdx = newchildren.length - 1
    let newEndVnode = newchildren[newEndIdx]
    // 从尾开始比较   
    while (oldEndVnode.key === newEndVnode.key) {
      patch(oldEndVnode, newEndVnode, el)
      oldEndIdx--
      oldEndVnode = oldchildren[oldEndIdx]
      newEndIdx--
      newEndVnode = newchildren[newEndIdx]
    }

    if (j > oldEndIdx && j <= newEndIdx) { // 说明 旧节点已经遍历完了 新节点还有剩余
      let anchorIdx = newEndIdx + 1
      let anchor = anchorIdx < newchildren.length ? newchildren[anchorIdx].el : null
      while (j <= newEndIdx) {
        patch(null, newchildren[j++], el, anchor)
      }
    } else if (j > newEndIdx && j <= oldEndIdx) { // 说明 新节点已经遍历完了 旧节点还有剩余
      for (let i = j; i <= oldEndIdx; i++) {
        unmount(oldchildren[i])
      }
    } else {
      // 构造source 数组
      const count = newEndIdx - j + 1
      const source = new Array(count).fill(-1)
      const oldStartIdx = j
      const newStartIdx = j
      const keyIndex = {}
      let moved = false
      let pos = 0
      for (let i = newStartIdx; i <= newEndIdx; i++) {
        keyIndex[newchildren[i].key] = i
      }
      let patched = 0 // 代表更新过的节点数量
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        const oldVnode = oldchildren[i]
        if (patched < count) {
          const k = keyIndex[oldVnode.key]
          if (typeof k !== 'undefined') {
            const newVnode = newchildren[k]
            patch(oldVnode, newVnode, el)
            source[k - newStartIdx] = i
            if (k < pos) {
              moved = true
            } else {
              pos = k
            }
            patched++
          } else { // 说明 旧节点不存在 需要卸载
            unmount(oldVnode)
          }
         
        } else {
          unmount(oldVnode)
        }
      }
      if (moved) {
        const seq = getSequence(source)
        let s = seq.length - 1
        let i = count - 1
        for (;i >= 0; i--) {
          if (source[i] === -1) { // 说明未找到匹配的旧节点 是新增的子节点
            const pos = i + newStartIdx
            const newEndVnode = newchildren[pos]
            const nextPos = pos + 1
            const anchor = nextPos < newchildren.length ? newchildren[nextPos].el : null
            patch(null, newEndVnode, el, anchor)
          } else if (i !== seq[s]) { // 说明 需要移动
            const pos = i + start
            const newEndVnode = newchildren[pos]
            const nextPos = pos + 1
            const anchor = nextPos < newchildren.length ? newchildren[nextPos].el : null
            insert(newEndVnode.el, el, anchor)
          } else {
            s--
          }
        }
        
      }
    }
    
  }

  function getSequence(arr) { // 获取最长递归子序列
    const p = arr.slice()
    const stack = []
    let ans = [], len = arr.length
    for (let i = 0; i < arr.length; i++) {
      if (!stack.length || arr[i] > stack[stack.length - 1]) stack.push(arr[i])
      else {
        ans = stack.length > ans ? [...stack] : ans
        let top = stack[stack.length - 1]
        while (top > arr[i] && stack.length) {
          stack.pop()
          top =  stack.length ? stack[stack.length - 1] : ''
        }
        stack.push(arr[i])
      }
    }
    ans = stack.length > ans ? [...stack] : ans
    return ans
  }

  return {
    render,
    hydrate
  }
}

const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  createText(text) {
    return document.createTextNode(text)
  },
  setText(el, text) {
    el.nodeValue = text
  },
  patchProps(el, key, preValue, nextValue) {
    if (/^on/.test(key)) { // 事件处理
     
      // preValue && el.removeListener(name, preValue)
      // el.addEventListener(name, nextValue) 

      let invokers = el._vei || (el._vei = {}) // 获取该元素伪造的事件处理函数 vei 是 vue event invoker
      let invoker = el._vei[key]
      let name = key.slice(2).toLowerCase()
      if (nextValue) {
        if (!invoker) {
          invoker = el._vei[key] = (e) => {
            // e.timeStamp 是事件的开始时间
            // 当事件的开始时间 小于 事件的绑定时间 则不执行
            if (e.timeStamp < invoker.attached) return
            // 当伪造的处理函数执行时 会执行真正的函数
            if (Array.isArray(invoker.value)) { // 函数数组
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }
          invoker.value = nextValue // 绑定真正的函数
          invoker.attached = performance.now()
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue // 不用移除旧函数
        }
      } else {
        el.removeListener(name, invoker)
      }
    } else if (key === 'class') {
      el.className = nextValue // 也可以用el.classList 设置
    } else if (shouldSetAsProps(el, key, value)) {
      // 获取 DOM 对应  property 的类型
      const type = typeof el[key]
      if (type === 'boolean' && value === '') {
        el[key] = true
      } else {
        el[key] = value
      }
    } else {
      el.setAttribute(key, vnode.props[key])
    }
  }
})


  function shouldSetAsProps(el, key, value) {
    // 特殊处理 只读属性 无法通过 DOM property = xx 设置
    if (key === 'form' && el.tagName === 'INPUT') return false
    return key in el
  }

