const path = require('path')

let str1 = path.join('/a', '/b/c', '../', '/d/e')
console.log(str1)

let str2 = path.join(__dirname, './files/11.txt')
console.log(str2)

let filename = path.basename('/a/b/c/index.html') // index.html
console.log(filename)
filename = path.basename('/a/b/c/index.html', '.html') // index
console.log(filename)

path.extname('/a/b/c/index.html') // .html
