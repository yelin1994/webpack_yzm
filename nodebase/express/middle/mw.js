const querystring = require('querystring')
function mw(req, res, next) {
  let str = ''
  req.on('data', (chunk) => {
    str += chunk
  })
  req.on('end', () => {
    const body = querystring.parse(str)
    console.log()
    next()
  })
}

module.exports = mw