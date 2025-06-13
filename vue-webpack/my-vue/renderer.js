import { reactive, effect, shallowReactive, shallowReadonly } from './watch'

const Text = Symbol() // 标识文本节点
const Comment = Symbol() // 注释节点的type
const Fragment = Symbol() 

const queue = new Set() // 任务缓冲队列
let isFlushing = false // 是否正在刷新中
const p = Promise.resolve()
let currentInstance = null // 全局变量，存储当前正在被初始化的组件实例

function setCurrentInstance(instance) {
  currentInstance = instance
}

function  ququeJob(job) { // 调度器的主要函数 用来添加任务到缓冲队列中
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
    } else if (typeof type === 'object' || typeof type === 'function') { //自定义组件, 函数式组件
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
      type: MyCOmponent，
      props: {
        title: '133'
      }
    }
   */

    // const Comp = {
    //   setup() {
    //     // setup 返回一个函数将作为渲染函数
    //     return () => {
    //       return { type: 'div', children: 'hello' }
    //     }
    //   }
    // }

    // const Comp = {
    //   setup() {
    //     const count = ref(0)
    //     return {
    //       count 
    //     }
    //   },
    //   render() {
    //     // 通过this 可以访问 setup 暴露出来的响应式数据
    //     return { type: 'div', children: `count is: ${ this.count}`}
    //   }
    // }

    // const Comp = {
    //   props: {
    //     foo: String
    //   },
    //   setup(props, setupContext) {
    //     props.foo // 访问传入的props 数据
    //     // setupContext 中包含与组件接口相关的重要数据
    //     const { slots, emit, attrs, expose } = setupContext
    //   }
    // }

  // function MyFuncComp(props) {
  //   return { type: 'h1', children: props.title }
  // }
  //  // 定义 props
  // MyFuncComp.props = {
  //   title: String
  // }

  function mountComponent(vnode, container, anchor) {
    const isFunctional = typeof node.type === 'function'
    const componentOption = vnode.type // 获取组件的选项对象
    if (isFunctional) {
      componentOption = {
        render: vnode.type,
        props: vnode.type.props
      }
    }
    let { render, data,  props: propsOptions, setup,
      beforeCreate, created, beforeMount,mounted, beforeUpdate, updated } = componentOption // 获取组件的渲染方式
    // 在这里调用beforeCreate
    beforeCreate && beforeCreate()
    const state = data ? reactive(data()) : null

    // 调用resolveProps 解析出最终的props 数据与attrs 数据
    const [props, attrs] = resolveProps(propsOptions, vnode.props)
    const slots = vnode.children
    // 定义组件失利
    const instance = {
      state,
      isMounted: false,
      props: shallowReactive(props)
      // 组件渲染的内容 子树
      subTree: null,
      slots,
      mounted: [] // 在组件实例中添加 mounted 数组，用来存储通过onMounted 函数注册的生命周期钩子函数
    }

    function emit(event, ...playload) { // event 事件名称 playload 传递给事件处理函数的参数
      const eventName =`on${event[0].toUpperCase() + event.slice(1)}`
      const handler = instance.props[eventName]
    }

    const setupContext = { attrs, emit, slots }
    setCurrentInstance(instance) // 在调用setup函数之前，设置当前组件实例
    const setupResult = setup(shallowReadonly(instance.props, setupContext))
    setCurrentInstance(null)
    let setupState = null // 用来存储 setup 返回的数据
    if (typeof setupResult === 'function') {
      if (render) console.error('setup 函数返回渲染函数, render 选项将被忽略')
      render = setupResult
    } else {
      setupState = setupResult
    }

    vnode.component = instance
    // 创建渲染上下文对象，本质上是组件实例的代理
    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        // 取得组件自身状态 与 props 数据
        const { state, props} = t
        if (k === '$slots') return slots
        // 先尝试读取自身状态数据
        if (state && k in state) {
          return state[k]
        } else if (k in props) { // 如果组件自身没有该数据， 则尝试 从props 读取
          return props[k]
        } else if (setupState && k in setupState) {
          return setupState[k]
        } else {
          console.error('不存在')
        }
      },
      set (t, k, v, r) {
        const { state, props } = t
        if (state && k in state) {
          state[k] = v
        } else if (k in props) {
          console.warn(`Attempting to mutate prop "${k}". props are readonly`)
        } else if (setupState && k in setupState) {
          setupState[k] = v
        } else {
          console.error('不存在')
        }
      }
    })
    
    // 在这里调用created 钩子 要绑定渲染上下文对象
    created && created.call(renderContext)
    // 当组件自身状态发生变化时 能实现自更新
    effect(() => {
      const subTree = render.call(renderContext, renderContext) // render 会返回虚拟 DOM, 将this 设为 state
      if (!instance.isMounted) {
        // beforeMount
        beforeMount && beforeMount.call(state)
        // 初次挂载
        patch(null, subTree, container, anchor)
        // 挂载完成
        instance.isMounted = true
        // 调用mounted
        mounted && mounted.call(renderContext)
        instance.mounted && instance.mounted.forEach(hook => hook.call(renderContext))
      } else {
        beforeUpdate && beforeUpdate.call(state)
        // 新的子树与上一次渲染的子树 进行打补丁
        patch(instance.subTree, subTree, container, anchor)
        updated && updated.call(state)
      }
      instance.subTree = subTree
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
    } else if (typeof vnode.type === 'object') {
      unmount(vnode.component.subTree)
    }
    let parent = vnode.el.parentNode
    if (parent) parent.removeChild()
  }

  function patchComponent(oldnode, vnode, anchor) {
    // 获取组件实例，即oldnode.component
    const instance = (vnode.component = oldnode.component)
    // 获取当前的props
    const { props } = instance
    if (hasPropsChanged(oldnode.props, vnode.props)) {
      const [nextProps] = resolveProps(vnode.type.props, vnode.props)
      for (let k in nextProps) {
        props[k] = nextProps[k]
      }
      // 删除不存在的props
      for (let k in props) {
        if (!(k in nextProps)) delete props[k]
      }
    }

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
        if (oldchildren[j].key === newchildren[i].key) {
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
        if (oldIdx > 0) { // 存在可服用的节点
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
        const seq = getSequence(source) //最长递归子序列
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

  function resolveProps(options, propsData) {
    const props = {}
    const attrs = {}
    for (let key in propsData) {
      if (key in options || key.startsWith('on')) { // @change 之类 方便emit 抛出
        // 如果为组件传递的props数组在组件自身的props 选项中有定义，则将其视为合法的props
        props[key] = propsData[key]
      } else {
        // 否则视作为attrs
        attrs[key] = propsData[key]
      }
    }
    return [props, attrs]
  }

  function hasPropsChanged(preProps, nextProps) {
    const nextKeys = Object.keys(nextProps)
    if (nextKeys.length !== Object.keys(preProps).length) {
      return true
    }
    for (let i = 0 ; i < nextKeys.length; i++) {
      const key = nextKeys[i]
      if (nextProps[key] !== preProps[key]) return true
    }
    return false
  }

  function onMounted(fn) {
    if (currentInstance) {
      currentInstance.mounted.push(fn)
    } else {
      console.log('onMounted 函数只能在setup 中调用')
    }
  }

  function onUmounted(fn) {

  }

  export default {
    Text,
    onUmounted
  }

