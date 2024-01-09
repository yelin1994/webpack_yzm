const fs = require('fs')

// 读取文件 方法
// fs.readFile('./files/11.txt', 'utf-8', (err, result) => {
//   if (err) {
//     console.log('读取文件失败：', err.message )
//     return
//   }
//   console.log(result)
// })

// 写入文件
// let str = ['你好啊', '你是谁']
// for (let c  of str) {
//   fs.writeFile('./files/11.txt', c, 'utf-8', function(err, result) {
//     // 文件写入 直接覆盖
//     if (err) {
//       console.log('写入文件失败', err.message)
//       return
//     }
//     console.log('文件写入成功')
//   })
// }

// 拼接文件
// fs.readFile('./files/11.txt', 'utf-8', (err, result) => {
//   if (err) {
//     console.log('读取文件失败：', err.message )
//     return
//   }
//   const arrold = result.split(' ')
//   let arrNew = []
//   for (let info of arrold) {
//     arrNew.push(info.replace('=', ':'))
//   }
//   console.log(arrNew)
//   for (let info of arrNew) {
//     fs.appendFile('./files/12.txt', info + '\n', (err) => {
//       if (err) return console.log(err.message)
//       console.log('写入成功')
//     })
//   }
// })

// node 执行文件时 如果使用相对路径 ./ 或者 ../ 会以执行node所处的目录 执行动态拼接 容易出错
// 在files 执行node js 会读取不到文件信息
// 可以使用 __dirname + 相对路径 获取绝对路径
console.log(__dirname)
