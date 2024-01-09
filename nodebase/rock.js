const fs = require('fs')
const path = require('path')

const regStyle = /<style>([\s\S]*)<\/style>/

const regScript = /<script>([\s\S]*)<\/script>/

fs.readFile(path.join(__dirname, './files/lock.html'), 'utf-8', function(err, result) {
  if (err) return console.log(err.message)
  resolveCss(result)
  resolveJs(result)
  resolveHtml(result)
})

function resolveCss(htmlStr) {
  const res = regStyle.exec(htmlStr)
  const newCss = res[1]
  fs.writeFile(path.join(__dirname, './files/lock.css'), newCss, function(err, res) {
    if (err) console.log(err.message)
  })
}

function resolveJs (htmlStr) {
  const res = regScript.exec(htmlStr)
  const newJs = res[1]
  fs.writeFile(path.join(__dirname, './files/lock.js'), newJs, function(err, res) {
    if (err) {
      console.log(err.message)
      return
    } 
  })
}

function resolveHtml(htmlStr) {
  const newHtml = htmlStr
    .replace(regStyle, '<link rel="stylesheet" href="./lock.css" />')
    .replace(regScript, '<script src="./lock.js"></script>')
  fs.writeFile(path.join(__dirname, './files/lock1.html'), newHtml, function(err, res) {
    if (err) {
      console.log(err.message)
    } 
  })
}