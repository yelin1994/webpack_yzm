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