const config = require('./config')
const fs = require('fs')
const files = fs.readdirSync(config.svgdir)
const camelname = (str) => {
  let reg = /-(\w)/g;
  return str.replace(reg, ($0, $1) => {
    return $1.toUpperCase()
  })
}
let len = files.length
let text = 'module.exports = {\n'
files.forEach((item, index) => {
  if (/\.svg$/.test(item)) {
    let name = camelname(item.replace(/\.svg$/, ''))
    if (index < len -1) {
      text += "  " + name + ": require('./" + item + "'),\n"
    } else {
      text += "  " + name + ": require('./" + item + "')\n"
    }
  }
})
text += '}\n'
fs.writeFile(config.svgdir + '/index.js', text, (err) => {
  if (err) throw err
})
