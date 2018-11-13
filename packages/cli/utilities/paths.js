const fs = require('fs')
const path = require('path')

const rootPath = fs.realpathSync(process.cwd())

const reactScriptsPath = path.join(
  require.resolve('react-scripts/package.json'),
  '..',
)

module.exports = {rootPath, reactScriptsPath}
