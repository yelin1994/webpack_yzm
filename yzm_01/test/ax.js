const axios = require('axios')
const e = require('express')
axios.get('http://localhost:8100/user').then(value => {
  console.log('resolve', value.data)
}).catch(err => {
  console.log('errr', err.response.status)
})