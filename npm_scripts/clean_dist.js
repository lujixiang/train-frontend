let fs = require('fs')
let path = require('path')
console.log('--------------------------------------------------------')
console.log('|                                                      |')
console.log('|                  构建之前清空dist文件夹              |')
console.log('|                                                      |')
console.log('--------------------------------------------------------')
const _cleandir = (dir) => {
  let files = []
  if (fs.existsSync(dir)) {
    files = fs.readdirSync(dir)
    files.forEach((file, index) => {
      let currentDir = path.join(dir, file)
      fs.statSync(currentDir).isDirectory() ? _cleandir(currentDir) : fs.unlinkSync(currentDir)
    })
    fs.rmdirSync(dir)
    console.log(dir + '文件夹已经清空')
  } else {
    console.log('文件夹已经清空')
  }
}
// _cleandir('./dist')
module.exports = _cleandir