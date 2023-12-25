const http = require('http')
const url = require('url')
const querystring = require('querystring')
const server = http.createServer((req, res) => {
  const reqUrl = req.url
  // 方式1
  const urlObj = url.parse(reqUrl, true)
  // 方式2
  const urlObj2 = querystring.parse(reqUrl)
  console.log(urlObj.query, urlObj2.query)
  let str = ''
  req.on('data', (chunk) => { // 接收数据
    str += chunk
  })
  req.on('end', () => { // 数据接收完成
    querystring.parse(str)
  })
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' })
  res.end('你好')
})
server.listen(8080, () => {
  console.log('server start')
})
