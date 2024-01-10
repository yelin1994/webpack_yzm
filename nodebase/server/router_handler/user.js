const dp = require('../dp/index')
const bcryptjs = require('bcryptjs')
const config = require('../config')
const jwt = require('jsonwebtoken')
const reguser = (req, res) => {
  const userInfo = req.body
  if (!userInfo.username || !userInfo.password) { // 判断注册的用户 数据 是否合适
    return res.send({ status: 500000, msg: '用户名或密码不能为空'})
  }
  const searchStr = 'select * from ev_user where username=?'
  dp.query(searchStr,[userInfo.username], (err, result) => {
    if (err) return console.log(err.message)
    console.log(result)
    if (result.length >= 1) {
      return res.send({ status: 500000, msg: '该用户已被占用'})
    } else {
      userInfo.password = bcryptjs.hashSync(userInfo.password, 10)
      const insertStr = 'insert into ev_user set?'
      dp.query(insertStr, userInfo, (err, res2) => {
        if (err) {
          return res.send({ status: 500000, msg: err.message })
        }
        if (res2.affectedRows !== 1) {
          return res.send({ status: 500000, msg: '注册失败'})
        }
        res.send({ status: 200000, msg: '注册成功'})
      })
    }
  })
}

const login = (req, res) => {
  const userInfo = req.body
  const searchStr = 'select * from ev_user where username=?'
  dp.query(searchStr, [userInfo.username], (err, result) => {
    if (err) {
      return res.send({
        status: 500000,
        msg: err.message
      })
    }
    if (result.length !== 1) return res.send({ status: 500000, msg: '用户名不存在，请检查'})
    const compareResult = bcryptjs.compareSync(userInfo.password, result[0].password) // 将输入的密码与 加密后的密码进行比较
    if (!compareResult) return res.send({ status: 500000, msg: '密码不正确'})
    const tokenStr = jwt.sign({ username: result[0].username, nickname: result[0].nickname }, config.jwtSecret, { expiresIn: '10h'})
    res.send({ status: 1, msg: 'login', token: 'Bearer ' + tokenStr })
  })
}

module.exports = {
  reguser,
  login
}