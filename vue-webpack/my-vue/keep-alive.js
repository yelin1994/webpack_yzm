let currentInstance = null // 先复用 renderer 中
let container = null
const KeepAlive = { // 卸载 是移动到一个隐藏的容器， 挂载是从一个隐藏容器中取出
  __isKeepAlive: true, // keepalive 组件独有的属性，用作标识
  props: {
    include: RegExp,
    exclude: RegExp
  }
  setup(props, { slots }) {
    const cache = new Map() // key 为 vnode.type value: vnode
    const instance = currentInstance // 当前keepalive 的组件实例
    const { move, createElement} = instance.keepAliveCtx // 对于 keepAlive 组件 它的实例存在特殊的keepAliveCtx, 由渲染器注入
    const storageContainer = createElement('div') // 创建隐藏容器
    instance._deActive = () => {
      move(VideoEncoder, storageContainer)
    }

    instance._active = (vnode, conatiner, anchor) => {
      move(vnode, cotainer, anchor)
    }

    return () => {
      let rawVNode = slots.default() // keepAlive 的默认插槽就是要被keepAlive 的组件， 如果不是组件 直接渲染，因为非组件的虚拟节点无法被keepAlive
      if (typeof rawVNode.type !== 'object') {
        return rawVNode
      }
      const name = rawVNode.type.name
      if (name && ((props.include && !props.include.test(name)) || (props.exclude && props.exclude.test(name)))) {
        return rawVNode // 直接渲染组件不进行其他操作
      }
      const cachedVNode = cache.get(rawVNode.type) // 在挂载时 先获取缓存的组件
      if(cachedVNode) {
        rawVNode.component = cachedVNode.component // 如果有缓存的内容 则说明不应该执行挂载 而应该执行激活 继承组件实例
        rawVNode.keptAlive = true // 在 vnode 上添加 keptAlive  避免重新挂载
      } else {
        cache.set(rawVNode.type, rawVNode) // 如果没有缓存, 则将其添加到缓存中，这样下次激活组件时 就不会执行新的挂载动作
      }
      rawVNode.shouldKeepAlive = true // 在组件
      rawVNode.keepAliveInstance = instance
      return rawVNode // 渲染组件
    }
  }
}