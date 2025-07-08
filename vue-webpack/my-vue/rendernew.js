const dynamicChildrenStack = [] // 动态节点栈
let currentDynamicChildren = null 

function openBlock() {
  currentDynamicChildren = []
  dynamicChildrenStack.push(currentDynamicChildren)
}

function  closeBlock() {
  currentDynamicChildren = dynamicChildrenStack.pop() // 弹出栈顶元素
}

function createVNode(tag, props, children, flags) {
  const key = props && props.key
  props && delete props.key
  const vnode = {
    tag,
    props,
    children,
    key,
    patchFlag: flags,
  }
  if (typeof flags !== 'undefined') {
    vnode.patchFlag = flags
  }
  if (currentDynamicChildren) {
    currentDynamicChildren.push(vnode)
  }
  return vnode
}

function createBlock(tag, props, children) {
  const block = createVNode(tag, props, children)
  block.dynamicChildren = currentDynamicChildren
  closeBlock()
  return block
}