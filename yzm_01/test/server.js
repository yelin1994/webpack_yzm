const express = require('express')

const app = express()
app.get('/user', function(req, res) {
  res.status(400)
  res.end('eeeeee')
})
app.listen(8100)