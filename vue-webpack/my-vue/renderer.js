function createRenderer(options) {
  const {
    createElement,
    setElementText,
    insert,
    patchProps
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


  function patch(oldnode, vnode, container) {
    if (oldnode && oldnode.type !== vnode.type) {
      //如果新旧node 的类型不一致 则将 旧node 卸载
      unmount(oldnode)
      oldnode = null
    }

    const { type } = vnode
    if (typeof type === 'string') { // 普通标签
      if (!oldnode) {
        mountElement(vnode, container)
      } else {
        patchElement(oldnode, vnode)
      }
    } else if (typeof type === 'object') { //自定义组件

    } else if (type === 'xxx') {

    }
   
  }

  function mountElement(vnode, container) {
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
    insert(vnode, container)
  }

  function unmount(vnode) {
    let parent = vnode.el.parentNode
    if (parent) parent.removeChild()
  }

  function patchElement(oldnode, vnode) {
    const el = oldnode.el = vnode.el
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
