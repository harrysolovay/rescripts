const {join} = require('path')
const {existsSync} = require('fs')

const reactScriptsPaths = require(join(
  join(require.resolve('react-scripts/package.json'), '..'),
  'config/paths',
))

const {appPath, ownPath, appNodeModules} = reactScriptsPaths

const paths = {
  ...reactScriptsPaths,
  ownConfigsPath: join(ownPath, 'config'),
  ownScriptsPath: join(ownPath, 'scripts'),
}

const existsInAppRoot = fileName => existsSync(join(appPath, fileName))

const resolveRelativeOrNodeModule = pathOrName =>
  existsInAppRoot(pathOrName)
    ? join(appPath, pathOrName)
    : join(appNodeModules, pathOrName)

module.exports = {
  paths,
  existsInAppRoot,
  resolveRelativeOrNodeModule,
}
