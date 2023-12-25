const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = ''
    return render(vnode, container)
  }
}

function render(vnode, container) {
  if (vnode == undefined) return 
  if (typeof vnode == 'string') {
    const textNode = document.createTextNode(vnode)
    return container.appendChild(textNode)
  }

  const {
    tag
  } = vnode

  const dom = document.createElement(tag);
  console.log(dom)

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const val = vnode.attrs[key]
      setAttribute(dom,key, val)
    })
  }

  vnode.childrens.forEach(child => render(child, dom))

  return container.appendChild(dom)
}


function setAttribute(dom, key, val) {
  if (key === 'className') {// 类名替换
    key = 'class'
  }

  if (/on\w+/.test(key)) { // 事件监听

    key = key.toLowerCase()
    dom[key] = val || ''

  } else if (key === 'style') {
    if (!val || typeof val === 'string') {
        dom.style.cssText = value || ''
    } else if (val && typeof val  === 'object') {
      for (let k in val) {
        if (typeof val[k] === 'number') {
          dom.style[k] = val[k] + 'px'
        } else {
          dom[style][k] = val[k]
        }
      }
    }
  } else {
    console.log(key, dom)

    if (key in dom) {
      dom[key] = val
    }

    if (val) {
      dom.setAttribute(key, val)
    } else {
      dom.removeAttribute(key)
    }
  }
}

export const renderComponent = () => {}

export default ReactDOM
