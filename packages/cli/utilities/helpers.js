const fs = require('fs')
const path = require('path')
const {rootPath} = require('./paths')

const existsInRoot = name => fs.existsSync(path.join(rootPath, name))

module.exports = {existsInRoot}
