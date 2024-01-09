const express = require('express')
const router = express.Router()

const userHandler = require('../router_handler/user')
const Joi = require('joi') // 定义验证规则
const expressJoi = require('@escook/express-joi') // 实践规则

const userScheme = {
  body: {
    username: Joi.string().alphanum().min(1).max(12).required(), // a-z 0-9  长度范围 3 - 12
    password: Joi.string().pattern(/^[\S]{6, 15}$/).required() // 非空格 6 到15位字符
  }
}

router.post('/reguser', expressJoi(userScheme), userHandler.reguser)

router.post('/login', userHandler.login)

module.exports = router