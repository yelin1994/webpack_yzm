import { ref, shallowRef } from './watchRef'
import { Text, onUmounted } from './renderer'

// export default {
//   components: {
//     AsyncComp: defineAsyncComponent({
//        loader: () => import('ComA')}),
          // timeout: 2000, // 超时时间
          // errorComp: ErrorComp, // 出错时渲染组件
          // delay: 200,
          // loadingComp: {
          //   setup() {
          //     return () => {
          //       return { type: 'h2', children: '...loading' }
          //     }
          //   }
          // }
//   }
// }
function defineAsyncComponent(options) {
  if (typeof options === 'function') {
    options = {
      loader: options
    }
  }

  const { loader } = options
  let InnerComp = null // 用来存储异步加载的组件

  let retries = 0
  function load() {
    return loader().catch((err) => {
      if (options.onError) {
        return new Promise((resolve, reject) => {
          const retry = () => {
            resolve(load())
            retries++
          }
          const fail = () => reject(err)
          options.onError(retry, fail, retries)
        })
      } else {
        throw err
      }
    })
  }
  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false)
      const error = shallowRef(null) // 当错误发生时 用来存储错误对象
      // const timeout = ref(false) // 代表是否超时
      const loading = ref(false)

      let loadingTimer = null
      if (options.delay) {
        loadingTimer = setTimeout(() => {
          loading.value = true
        }, options.delay)
      } else {
        loading.value = true
      }
      let timer = null
      // 异步加载成功后 将组件存储在 InnerComp
      load().then(c => {
        InnerComp = c
        clearTimeout(timer)
        loaded.value = true
      }).catch(err => error.value = err).finnally(() => {
        loading.value = false
        clearTimeout(loadingTimer)
      })
     
      if (options.timeout) {
        timer = setTimeout(() => {
          // timeout.value = true
          const err = new Error(`Async Component time out after ${options.timeout} ms`)
          error.value = err
        }, options.timeout)
      }

      onUmounted(() => clearTimeout(timer)) // 组件卸载的时候 清除 定时器
      const placeholder = { type: Text, children: '' }
      return () => {
        if (loaded.value) {
          return { type: InnerComp }
        } else if (error.value) {
          return options.errorComp ? { type: errorComp, props: { error: error.value } } : placeholder
        } else if (loading.value && options.loadingComp) {
          return { type: options.loadingComp }
        }
        return placeholder
      }
    }
  }
}