const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')
const Joi = require('joi')
const { expressjwt } = require('express-jwt')
const config = require('./config')

const app = express()
app.use(cors()) // 跨域问题
app.use(express.urlencoded({extended: false })) // 只能处理 application/x-www-form-urlencode
app.use((req, res, next) => {
  res.cc = (status, msg) => { // 注册集中处理函数
    res.send({
      status,
      msg
    })
  }
  next()
})
// 会将请求头中的Authorition 中的token 解析道req.auth 上
app.use(expressjwt({ secret: config.jwtSecret, algorithms: ["HS256"] }).unless({ path: [/^\/api\//]})) // api /开头的不需要防伪权限
app.listen(8081, () => {
  console.log('server listen at 8081')
})

app.use('/api', userRouter) // 挂载前缀

app.use((err, req, res, next) => {
  if (err instanceof Joi.ValidationError) {
    return res.send({
      status: 500000,
      message: err.message
    })
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  }
  res.send({
    status: 500000,
    message: err.message
  })
})