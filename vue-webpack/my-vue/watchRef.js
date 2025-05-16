import { reactive } from './watch'

function ref(val) {
  const wrapper = {
    value: val
  }
  // 区分是不是ref 还是 reactive({ value: val }) 定义一个属性
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return reactive(wrapper)
}

// 主要是问了解决响应式丢失问题

function toRef(obj, key) {
  const wrappger = {
    get value() {
      return obj[key]
    },
    set value(val) {
      obj[key] = val
    }
  }
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return wrapper
}

function toRefs(obj) {
  const ret = {}
  for (let key of obj) {
    ret[key] = ref(obj, key)
  }
  return ret
}
// setup() 会默认调用proxyRefs
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      if (value.__v_isRef) return value.value
      return value
    },
    set(target, key, newvalue, receiver) {
      const value = target[key]
      if (value.__v_isRef) {
        value.value = newvalue
        return true
      }
      return Reflect.set(target, key, newvalue, receiver)
    }
  })
}


const obj = reactive({ foo: 1, bar: 2 })
const newObj = proxyRefs({...toRefs(obj)})
