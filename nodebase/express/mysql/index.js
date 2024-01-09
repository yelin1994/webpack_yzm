const mysql = require('mysql')

const db = mysql.createPool({
  database: 'practice', 
  username: 'test', // 用户名
  password: '12345678', // 口令
  host: 'localhost', // 主机名
})

db.query('Select * from user', (err, result) => {
  if (err) return console.log()
})