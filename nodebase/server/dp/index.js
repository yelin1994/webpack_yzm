const mysql = require('mysql')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '031302526a',
  database: 'demo1'
})

module.exports = db