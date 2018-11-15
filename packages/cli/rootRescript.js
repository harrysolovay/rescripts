const {
  paths,
  resolveRelativeOrNodeModule,
  existsInAppRoot,
  error,
} = require('@rescripts/utilities')
const {appPath, appPackageJson} = paths
const {rescripts} = require(appPackageJson)
const {join} = require('path')

const rescriptPaths = rescripts
  ? typeof rescripts === 'string'
    ? [resolveRelativeOrNodeModule(rescripts)]
    : Array.isArray(rescripts)
    ? rescripts.map(resolveRelativeOrNodeModule)
    : error(`Invalid 'rescripts' configuration in ${appPackageJson}`)
  : existsInAppRoot('rescripts.js')
  ? [join(appPath, 'rescripts')]
  : ['@rescripts/rescript-default']

module.exports = rescriptPaths.map(require)
