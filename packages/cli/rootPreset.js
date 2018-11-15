const {paths} = require('@rescripts/utilities')
const {appPackageJson} = paths
const {rescripts} = require(appPackageJson)

if (rescripts) {
  if (typeof rescripts === 'string') {
    var rescriptPaths = [rescripts]
  } else if (Array.isArray(rescripts)) {
    var rescriptPaths = rescripts
  } else {
    const {presets} = rescripts
    if (presets) {
      var rescriptPaths = presets
    } else {
      console.log('ERROR')
      process.exit(1)
    }
  }
} else {
  var rescriptPaths = ['@rescripts/rescript-default']
}

module.exports = rescriptPaths.map(require)
