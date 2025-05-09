
  const bucket = new WeakMap()
  let activeEffect = null
  const data = { foo: 1, bar: 2 }
  const ITER_KEY = Symbol()
  const effectStack = [] // 为了解决 effect 嵌套
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
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      Reflect.set(target, key, newVal, receiver)
      // 把副作用函数从桶里取出并执行
     trigger(target, key, type)
    },

    has(target, key) { // 拦截 in 操作
      track(target, key)
      return Reflect.has(target, key)
    },

    ownKeys(obj) {
      track(target, ITER_KEY)
      return Reflect.ownKeys(target)
    },

    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadKey) { // 只有当删除成功 且属性是自己内部属性的时候 才触发更新
        track(target, key, 'DELETE')
      }
      return res
    }
  })
  
   // 在 get 拦截函数内调用 track 函数追踪变化
   function track(target, key) {
    // 没有 activeEffect，直接 return
    if (!activeEffect) return
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
  function trigger(target, key, type) {
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
    if (type === 'ADD' || type === 'DELETE') {
      const iteratorEffects = depsMap.get(ITER_KEY) // 跟踪for ... in
      iteratorEffects && iteratorEffects.forEach(fn => {
        if (fn !== activeEffect) {
          effectsRun.add(iteratorEffects)
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
  const p = PromiseRejectionEvent.resolve()
  let isFLushing = false // 代表是否在刷新
  return function() {
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
  let dirty = true
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
    if (cleanup) cleanup() // 上一次调用的onInvalidate
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



