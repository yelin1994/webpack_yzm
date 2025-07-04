
  const bucket = new WeakMap()
  let activeEffect = null
  const data = { foo: 1, bar: 2 }
  const ITER_KEY = Symbol()
  const MAP_KEY_ITERATOR_KEY = Symbol()
  const effectStack = [] // 为了解决 effect 嵌套
  // 一个标记变量、代表是否进行追踪。默认值为true、允许追踪
  let shouldTrack = true
  const effect = function(fn, options = {}) {
    // activeEffect = fn
    // fn()
    const effctFn = () => {
      cleanup(effctFn) // 先清楚依赖
      activeEffect = effctFn
      effectStack.push(effctFn) // 新增
      const res = fn() // 在fn中取
      effectStack.pop()
       // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并将ativeEffect还原为 之前的值
      activeEffect = effectStack.length ? effectStack[effectStack.length - 1] : null
      return res
    }
    // 用来存储与副作用相关联的依赖集合
    effctFn.deps = []
    effctFn.options = options
    if (!options.lazy) effctFn()
    return effctFn
  }
    const obj = new Proxy(data, {
     // 拦截读取操作
    get(target, key, receiver) {
     // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
      track(target, key)
      // 返回属性值
      // return target[key] // 当代理的对象有this 的时候 便会没办法相应
      return Reflect.get(target, key, receiver)
     },
     // 拦截设置操作
    set(target, key, newVal, receiver) {
       // 设置属性值
      // target[key] = newVal
      const oldVal = target[key]
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      Reflect.set(target, key, newVal, receiver)
      if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) { // NaN
         // 把副作用函数从桶里取出并执行
        trigger(target, key, type)
      }
    },

    has(target, key) { // 拦截 in 操作
      track(target, key)
      return Reflect.has(target, key)
    },

    ownKeys(target) {// for ... in
      track(target, ITER_KEY)
      return Reflect.ownKeys(target)
    },

    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadKey) { // 只有当删除成功 且属性是自己内部属性的时候 才触发更新
        trigger(target, key, 'DELETE')
      }
      return res
    }
  })
  
   // 在 get 拦截函数内调用 track 函数追踪变化
   function track(target, key) {
    // 没有 activeEffect，直接 return
    if (!activeEffect || !shouldTrack) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
    // deps 为当前副作用函数存在关联的集合
    activeEffect.deps.push(deps)
  }
  // 在 set 拦截函数内调用 trigger 函数触发变化
  function trigger(target, key, type, newVal) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    // const effectsRun = new Set(effects) // 避免cleanup 造成 set.delete 和 set.add 叠加循环
    // effectsRun && effectsRun.forEach(fn => fn())
    const effectsRun = new Set()
    effects && effects.forEach(fn => {
      if (fn !== activeEffect) { // 避免循环执行
        effectsRun.add(fn)
      }
    })
    if (Array.isArray(target) && key === 'length') {
      // 对于所有索引 > newval 的元素 需要将其对应的副作用函数取出来
      depsMap.forEach((effects, key) => { // Map.prototype.forEach((value, key))
        if (key >= newVal) {
          effects && effects.forEach(fn => {
            if (fn !== activeEffect) {
              effectsRun.add(fn)
            }
          })
        }
      })
    }
    // Map set keys
    if (type === 'ADD' || type === 'DELETE' && (Object.prototype.toString.call(target) === '[object Map]')) {
      const iteratorEffects = depsMap.get(MAP_KEY_ITERATOR_KEY)
      iteratorEffects && iteratorEffects.forEach(fn => {
        if (fn !== activeEffect) effectsRun.add(fn)
      })
    }
    if (type === 'ADD' || type === 'DELETE' || (type === 'SET' && Object.prototype.toString.call(target) === '[object Map]')) { // 新增 或者删除属性的时候 都要触发, Map 类型的 set 也要监听
      const iteratorEffects = depsMap.get(ITER_KEY) // 跟踪for ... in
      iteratorEffects && iteratorEffects.forEach(fn => {
        if (fn !== activeEffect) {
          effectsRun.add(fn)
        }
      })
    }

    if (type === 'ADD' && Array.isArray(target)) {
      const lengthEffects = depsMap.get('length')
      lengthEffects && lengthEffects.forEach(fn => {
        if (fn !== activeEffect) {
          effectsRun.add(fn)
        }
      })
    }
    effectsRun && effectsRun.forEach(fn => {
      if (fn.options.scheduler) { // 调度决定
        fn.options.scheduler(fn)
      } else {
        fn()
      }
    })
  }

function cleanup(effectFn) {
     // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
       // deps 是依赖集合
    const deps = effectFn.deps[i]
    // 将 effectFn 从依赖集合中移除
    deps.delete(effectFn)
  }
  // 最后需要重置 effectFn.deps 数组
   effectFn.deps.length = 0
}

const createFlushJob = () => {
  const jobQueue = new Set()
  const p = Promise.resolve()
  let isFLushing = false // 代表是否在刷新
  return function(job) {
    jobQueue.add(job)
    if (isFLushing) return
    isFLushing = true
    p.then(() => {
      jobQueue.forEach(job => job())
    }).finally(() => {
      isFLushing = false
    })
  }
}

function computed(getter) {
  let value
  let dirty = true // 是否缓存
  const effectFn = effect(getter, { lazy: true, sheduler() {
    if (!dirty) {
      dirty = true
      trigger(obj, 'value')
    }
  } })
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      track(obj, 'value') // 将value 加入监听
      return value
    }
  }
  return obj
}
// const sumRes = computed(() => obj.foo + obj.bar)
// console.log(sumRes.value)
// obj.foo++
// console.log(sumRes.value)
function watch(source, cb, options = {}) {
  let getter // source 可以是一个对象 也可以是一个函数
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = traverse(source)
  }
  let newValue, oldValue
  let cleanup // 用来存储用户注册过的过期回掉
  function onInvalidate(fn) {
    cleanup = fn
  }
  const jobFunc = () => {
    newValue = effctFn()
    if (cleanup) cleanup() // 上一次调用的onInvalidate 把上一次调用 res 直接驳回调
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }
  const effctFn = effect(
    // 递归读取source的值 加入观察桶中
    () => getter(), {
      lazy: true,
      sheduler: () => {
        if (options.flush === 'post') {// 组件更新后执行
          Pormise.resolve().then(() => jobFunc())
        } else {
          jobFunc()
        }
      }
  })
 
  if (options.immediate) { // vue3 新增的立即执行
    jobFunc()
  } else {
     // 手动调用 拿到的值 就是旧值
    oldValue = effctFn()
  }
}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  // 避免循环调用
  seen.add(value)
  for (let prop of value) {
    traverse(value[prop], seen)
  }
  return value
}

const reactiveMap = new Map()

// let obj = {}
// let arr = reactive([obj])
// console.log(arr.inlcudes(arr[0])) // 没用reativeMap 会返回false 
// 因为 inlcudes 内部会去while 遍历 arr 代理对象， 而读取arr[0]的时候 也会重新创建代理对象。两次创建的代理对象不一致

function reactive(obj) {
  // 通过原始对象寻找代理
  let exsitObj = reactiveMap.get(obj)
  if (exsitObj) return exsitObj
  const proxy = createReactive(obj)
  reactiveMap.set(obj, proxy)
  return proxy
}

function readonly(obj) {
  return createReactive(obj, false, true)
}

function shallowReactive(obj) {
  return createReactive(obj, true)
}

function shallowReadonly(obj) {
  return createReactive(obj, true, true)
}


const arrInstrumentations = { // 重写arr 方法
  // includes: function(...argvs) {
  //   let res = originMethod.apply(this, argvs) // this 指向代理对象
  //   if (res === false) {
  //     res = originMethod.apply(this.raw, argvs) // this.raw 指向原始对象
  //   }
  //   return res
  // }
}

['includes', 'indexOf', 'lastIndexof'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrInstrumentations[method] = function(...argvs) {
     let res = originMethod.apply(this, argvs) // this 指向代理对象
    if (res === false || res === -1) {
      res = originMethod.apply(this.raw, argvs) // this.raw 指向原始对象
    }
    return res
  }
})

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrInstrumentations[method] = function(...argvs) {
    // 在调用原始方法、禁止追踪
    shouldTrack = false
    // push 方法的默认行为
    let res = originMethod.apply(this, args)
    // 在调用原始方法之后、恢复原来的行为、即允许追踪
    shouldTrack = true
    return res
  }
})

function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') return target // 指向被代理对象 obj
      if (Array.isArray(target) && arrInstrumentations.hasOwnProperty(key)) {
        return Reflect.get(arrInstrumentations, key, receiver)
      }
      if (!isReadonly && typeof key !== 'symbol') track(target, key) // 已读 和 symbol 属性不需要追踪 for...of 
      const res =  Reflect.get(target, key, receiver)
      if (isShallow) return res // 浅层响应
      if (typeof res === 'object' && res !== null) { // 为了解决 浅响应 浅只读
        return isReadonly ? readonly(res) : reactive(res)
      }
      return res
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const oldval = target[key]
      const type = Array.isArray(target) ? // 加入代理数组
        Number(key) > target.length ?  'ADD' : 'SET' 
       : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newVal, receiver)
      if (target === receiver.raw) { // 避免 receiver 设置未存在属性 去触发 原型对象的追踪
        if (oldval !== newVal && (oldval === oldval || newVal === newVal)) {
          trigger(target, key, type, newVal)
        }
      }
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadKey) { // 只有当删除成功 且属性是自己内部属性的时候 才触发更新
        trigger(target, key, 'DELETE')
      }
      return res
    },
     ownKeys(target) {// for ... in
      // 如果操作目标是 数组 则用 length 来追踪
      track(target, Array.isArray(target) ? 'length' :  ITER_KEY)
      return Reflect.ownKeys(target)
    },
  })
}

const set = new Set([1, 2, 3])
const mutableStrumentation = { // 代理set map 等对象
  add(key) {
    const target = this.raw
    const hadKey = target.has(key)
    const res = target.add(key)
    if (!hadKey) trigger(target, key, 'ADD')
    return res
  },

  delete(key) {
    const target = this.raw
    const hadKey = target.has(key)
    const res = target.delete(key)
    if (hadKey) trigger(target, key, 'DELETE')
    return res
  },
  get(key) {
    const target = this.raw
    const had = target.has(key)
    track(target, key)
    if (had) {
      const res = target.get(key)
      return typeof res === 'object' && res !== null ? reactive(res) : res
    }
  },
  set(key, value) {
    const target = this.raw
    const had = target.has(key)
    const oldVal = target.get(key)
    // 当value 是代理对象的时候 直接取他的原始对象 省的数据污染
    // Set 类型的 add 方法、普通对象的写值操作，还有为数组添加元素的方法等，都需要做类似的处理
    const rawValue = value.raw || value 
    target.set(key, rawValue)
    if (!had) {
      trigger(target, key, 'ADD')
    } else if (oldVal !== value && (old  === oldVal && value === value)) {
      trigger(target, key, 'SET')
    }
  },

  forEach(callback, thisArgs) {
    const target = this.raw
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val // 深层响应
    track(target, ITER_KEY)
    target.forEach((val, key) => {
      callback.call(thisArgs, wrap(val), wrap(key), this)
    })
  },

  [Symbol.iterator]() { // for ... of
    const target = this.raw
    const itr = target[Symbol.iterator]()
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val // 深层响应
    track(target, ITER_KEY)
    // return itr
    return {
      next() {
        const { value, done } = itr.next()
        return ({
          value: value && [wrap(value[0]), wrap(value[1])],
          done
        })
      }
    }
  },

  entries() {
    const target = this.raw
    const itr = target[Symbol.iterator]()
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val // 深层响应
    track(target, ITER_KEY)
    // return itr
    return {
      next() {
        const { value, done } = itr.next()
        return ({
          value: value && [wrap(value[0]), wrap(value[1])],
          done
        })
      },

      [Symbol.iterator]() { // 可迭代协议
        return this
      }
    }
  },

  values() {
    const target = this.raw
    const itr = target.values() // 获取原始对象的 迭代器方法
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val // 深层响应
    track(target, ITER_KEY)
    return {
      next() {
        const { value, done } = itr.next()
        return {
          value: wrap(value),
          done
        }
      },

      [Symbol.iterator]() {
        return this
      }
    }
  },
  keys() {
    const target = this.raw
    const itr = target.keys()
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val
    track(target, MAP_KEY_ITERATOR_KEY)
    return {
      next(){
        const { value, done } = itr.next()
        return {
          value: wrap(value),
          done
        }
      },
      [Symbol.iterator]() {
        return this
      }
    }
  }
}
const p = new Proxy(set, {
  get(target, key, receiver) {
    if (key === 'size') {
      // 如果读取的size 通过指定receiver 为 target 从而修复 p.size 报错的问题
      track(target, ITER_KEY)
      return Reflect.get(target, key, target)
    }
    if (key === 'raw') return target
    // return Reflect.get(target, key, receiver)
    // return target[key].bind(target)
    return mutableStrumentation[key]
  }
})

const obj2 = {
  next() { // 迭代器协议 只要实现了 next 方式

  },
  [Symbol.iterator]() { // 可迭代协议

  }
}
export default {
  reactive,
  shallowReactive,
  shallowReadonly,
  effect
}


