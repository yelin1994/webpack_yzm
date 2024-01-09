const express = require('express')

const router = express.Router()

router.use((req, res, next) => {
  console.log('路由级别中间件')
  next()
})

router.get('/user/list', (req, res) => {
  if (!req.session.isLogin) {
    return res.send({ status: 500000, msg: '请登录'})
  }
  res.send({ status: 0, msg: 'success', username: req.session.user.username })
})

router.post('/user/add', (req, res) => {
  // 可以用req.body 获取请求传过来的body 数据
  // 默认情况下 req.body 为undefined 需要配置express.json 中间件
  req.session.user = req.body
  req.session.isLogin = true
  res.send({
    status: 0,
    msg: '登录成功'
  })
})

router.post('/user/logout', (req, res) => {
  req.session.destroy() // 清除session 信息
  res.send({
    status: 0,
    msg: '退出成功'
  })
})

router.post('/user/info', (req, res) => {
  console.log(req.auth)
  res.send({
    status: 0,
    msg: 'success',
    data: req.user
  })
})

module.exports = router