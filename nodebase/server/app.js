const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')

const app = express()
app.use(cors()) // 跨域问题
app.use(express.urlencoded({extended: false })) // 只能处理 application/x-www-form-urlencode

app.listen(8081, () => {
  console.log('server listen at 8081')
})

app.use('/api', userRouter) // 挂载前缀