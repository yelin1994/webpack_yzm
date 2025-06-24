 <Teleport to="body">
  <h1>Title</h1>
  <p>container</p>
</Teleport>
function render() { 
  return {
    Type: Teleport,
    children: [
      { type: 'h1', children: 'Title' },
      { type: 'p', children: 'container' }
    ]
  }
}

const Teleport = {
  __isTeleport: true,
  process(n1, n2, container, anchor, internals) {
    const { patch, patchChildren, unmount, move } = internals
    if (!n1) {
      const target = typeof n2.props.to === 'string' ? document.querySelector(n2.props.to) : n2.props.to
      n2.children.forEach(c => patch(null, c, target, anchor))
    } else {
      patchChildren(n1, n2, container)
      if (n2.props.to !== n1.props.to) {
        const target = typeof n2.props.to === 'string' ? document.querySelector(n2.props.to) : n2.props.to
        n2.children.forEach(c => move(c, target, anchor))
      }
    }
  }
}


// 01 function render() {
// 02   return {
// 03     type: Transition,
// 04     children: {
// 05       default() {
// 06         return { type: 'div', children: '我是需要过渡的元素' }
// 07       }
// 08     }
// 09   }
// 10 }

const Transition = {
  name: 'Transition',
  setup(props, { slots }) {
    const innerVnode = slots.default() 
    innerVnode.transition = {
      beforeEnter(el) {
        // el.style.opacity = 0
        el.classList.add('enter-from')
        el.classList.add('enter-active')
      },
      enter(el) {
        nextFrame(() => {
          el.classList.remove('enter-from')
          el.classList.add('enter-to')
          el.addEventListener('transitionend', () => {
            el.classList.remove('enter-to')
            el.classList.remove('enter-active')
          })
        })
      },
      leave(el, performRemove) {
       el.classList.add('leave-from')
       el.classList.add('leave-active')
       nextFrame(() => {
        el.classList.remove('leave-from')
        el.classList.add('leave-to')
        el.addEventListener('transitioned', () => {
          el.classList.remove('leave-to')
          el.classList.remove('leave-active')
          performRemove()
        })
       })
      }
    }
    return innerVnode
  }
}

const nextFrame = requestAnimationFrame
