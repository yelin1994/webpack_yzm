const PENDING = 'pending'
const FULLFIELD = 'fulfilled'
const REJECTED = 'rejected'

class myPromise {
    constructor (fn) {
        this.fnQueue= [];
        try {
            fn(this.resolve, this.reject);
        } catch(error) {
            this.reject(error);
        }
       
    }
    status = PENDING;
    value = null;
    reason = null;
    onFulfieldCallback = [];
    onRejectedCallback = [];

    resolve =  (value) => {
        if (this.status === PENDING) {
            this.status = FULLFIELD;
            this.value = value;

            this.onFulfieldCallback.length && this.onFulfieldCallback.forEach(fn => {
               fn();
            })
        }
    }

    reject =  (reason)  => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
            this.onRejectedCallback.length  && this.onRejectedCallback.forEach(fn => {
               fn();
            })
        }
    }
}

myPromise.prototype.then = function(fullField, reject) {
    let onFullField = fullField ? fullField: value => value;
    let onReject = reject ? reject : reason => {throw reason};
    const promise2 = new myPromise((resolve, reject) => {
        if (this.status === REJECTED) {
            let y = onReject(this.reason)
            resolvePromise(promise2, y, resolve, reject);
        } else if (this.status === FULLFIELD) {
            queueMicrotask(() => {
                let x = onFullField(this.value);
                resolvePromise(promise2, x, resolve, reject)
            })
        } else if (this.status === PENDING) {
            queueMicrotask(() => {
                this.onFulfieldCallback.push(() => {
                    const x = onFullField(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                });
                this.onRejectedCallback.push(() => {
                    const y = onReject(this.reason);
                    resolvePromise(promise2, y, resolve, reject);
                });
            })
        }
    })
    return promise2; 
}

myPromise.resole = (value) => {
    return new myPromise((resolve, reject) => {
        resolve(value);
    })
}

myPromise.deffered = function () {
    result = {};
    result.promise = new myPromise(function(resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
    })
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        console.log(12312);
        return reject(new TypeError('Chaining cycle detected for promise'))
    }
    if (x instanceof myPromise) {
        x.then(resolve, reject);
    } else {
        resolve(x);
    }
}

let promise = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(12);
    }, 1000)
    // resolve(12);
    // reject(13);
    // throw new Error('执行器错误')
})
// promise.then(value => {
//     console.log(value)
// })

const p1 = promise.then(value => {
    console.log('2', value)
}, (res) => {
    console.log(res)
})
p1.then(() => {
    console.log('cycle');
}, (res) => {
    console.log(res)
})

promise.then(value => {
    console.log('3', value)
}).then(val => {
    console.log(4);
})

promise.then().then().then(value => console.log('5', value));
