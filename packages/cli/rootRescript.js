const {
  paths,
  resolveRelativeOrNodeModule,
  error,
} = require('@rescripts/utilities')
const {appPackageJson} = paths
const {rescripts} = require(appPackageJson)

const rescriptPaths = rescripts
  ? typeof rescripts === 'string'
    ? [resolveRelativeOrNodeModule(rescripts)]
    : Array.isArray(rescripts)
    ? rescripts.map(resolveRelativeOrNodeModule)
    : error(`Invalid 'rescripts' configuration in ${appPackageJson}`)
  : ['@rescripts/rescript-default']

module.exports = rescriptPaths.map(require)
