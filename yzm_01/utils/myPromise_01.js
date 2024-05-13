const PENDING = 'PENDING'
const FULFILED = 'FULFILED'
const REJECTED = 'REJECTED'

class myPromise {
  constructor(fn) {
    fn(this.resolve, this.reject)
  }
    value = null;
    reason = null;
    status = PENDING;
    onFulFiledCallback = [];
    onRejectCallback = [];
    resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILED
        this.value = value
        this.onFulFiledCallback.length && this.onFulFiledCallback.forEach(fn => {
          fn(this.value)
        })
      }
    }

    reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectCallback.length && this.onRejectCallback.forEach(fn => {
          fn(this.reason)
        })
      }
    }
}

myPromise.prototype.then = function(onFulFileds, onRejects) {
  let onFulFiled = typeof onFulFileds === 'function' ? onFulFileds : value => value
  let onReject = typeof onRejects === 'function' ? onRejects : reason => {
    throw reason
  }
  return promise2 = new myPromise((resolve, reject) => {
    if (this.status === FULFILED) {
      queueMicrotask(() => {
        let x = onFulFiled(this.value)
        resolvePromise(promise2, x, resolve, reject)
      })
    } else if (this.status === REJECTED) {
      queueMicrotask(() => {
        let y = onReject(this.reason)
        resolvePromise(promise2, y, resolve, reject)
      })
    } else if (this.status === PENDING) {
      queueMicrotask(() => {
        this.onFulFiledCallback.push(() => {
          let x = onFulFiled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        })
        this.onRejectCallback.push(() => {
          let y = onReject(this.reason)
          resolvePromise(promise2, y, resolve, reject)
        })
      })
    }
  })
}

myPromise.resolve = function(value) {
  return new myPromise((resolve, reject) => {
    resolve(value)
  })
}

myPromise.all = function (list) {
  let result = []
  return new myPromise((resolve, reject) => {
    list.forEach(promise => {
      promise.then(value => {
        result.push(value)
        if (result.length === list.length) resolve(result)
      }, err => {
        reject(err)
      })
    })
  })
}

myPromise.race = function(list) {
  return new myPromise((resolve, reject) => {
    list.forEach(promise => {
      promise.then(value => {
        resolve(value)
      }, err => {
        reject(err)
      })
    })
  })
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError('there is some promise cycle'))
  }

  if (x instanceof myPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}

let promise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(12)
  }, 1000)
  // resolve(12);
})

let promise2 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(13)
  }, 1000)
  // resolve(12);
})

let promise3 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(14)
  }, 1000)
  // resolve(12);
})

const promise4 = myPromise.all([promise, promise2, promise3])
const promise5 = myPromise.race([promise, promise2, promise3])
promise5.then(value => {
  console.log('race', value)
})
promise4.then(list => {
  console.log('list', list)
})

promise.then(value => {
  console.log('1', value)
})

promise.then(value => {
  console.log('2', value)
  return 3
}).then(value => {
  console.log(value)
})
