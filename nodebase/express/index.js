const express = require('express')
const path = require('path')
const userRouter = require('./routes/user')
const cors = require('cors')
const session = require('express-session')
const jsonwebtoken = require('jsonwebtoken') // 生成jwt 字符串
const { expressjwt } = require('express-jwt') // 将用户 返回的jwt 字符串 解析成 json 格式

const app = express()


app.listen(8080, () => {
  console.log('start listener')
})

const secretKey = 'tothebest No1'


app.use((req, res, next) => { // 全局中间件
  console.log('122 mid awer')
  next()
})
/*
 * JWT 由 Header/Playload/Signature 三部分组成
 * Header, Signature 安全性， Playload 用户的加密信息
*/


// 配置成功了 就会把解析出来的用户信息  挂载在req.auth
app.use(expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//]})) // api /开头的不需要防伪权限

app.use(session({ // 配置成功后 可以食用req.session 访问和使用session 对象
  secret: '12112hheea', // 加密的钥匙
  resave: false, // 固定写法
  saveUninitialized: false // 固定写法
}))
// 解析 json 格式数据
app.use(express.json())
// 解析 url encode 数据
app.use(express.urlencoded({ extended: false }))
app.get('/api/jsonp', (req, res) => {
  // 1 获取客户端回调函数的名字
  const callback = req.query.callback
  // 2 定义数据
  const data = { name: 'zs', age: 22 }
  const str = `${callback}(${JSON.stringify(data)})`
  res.send(str)
})
app.use(cors()) // 跨域问题

app.get('/user/age', function (req, res, next) {
  console.log('局部中间件')
  next()
}, (req, res) => {
  res.send('中间')
})
app.use(userRouter)

app.post('/api/user/login', (req, res) => {
  const userInfo = req.body
  // 接收三个参数 用户的信息对象， 加密的密钥， 配置对象， 不要把密码加密到 token 字符串中
  const tokenStr = jsonwebtoken.sign({username: userInfo.username}, secretKey, { expiresIn: '1h' })
  res.send({
    status: 200000,
    message: '登录成功',
    token: tokenStr
  })
})

app.use((err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'UnauthorizedError') {
    res.send({
      status: 401,
      msg: '无效的token'
    })
  }
  res.send('错误')
})

// const assetsRoute = path.join(__dirname, './assets')
// app.use('/public', express.static(assetsRoute)) // public/inde.html
// app.get('/home', (req, res) => {
//   console.log(req.query)
//   res.send('12312')
// })

// app.post('/user', (req, res) => {
//   res.send({ name: 'root', password: 'root' })
// })

// app.get('/article/:id', (req, res) => {
//   console.log(req.params)
//   res.send(req.params)
// })