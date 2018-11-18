const {paths, existsInAppRoot, error} = require('@rescripts/utilities')
const {join} = require('path')

module.exports = config => {
  const {appPackageJson, appPath} = paths
  const {babel: pkgBabel} = require(appPackageJson)

  const sources = [
    [!!pkgBabel, 'package.json "babel" field'],
    [existsInAppRoot('.babelrc'), '.babelrc file'],
    [existsInAppRoot('.babelrc.js'), '.babelrc.js file'],
    [existsInAppRoot('.babelrc.json'), '.babelrc.json file'],
    [existsInAppRoot('babel.config.js'), 'babel.config.js file'],
  ]
    .filter(([exists]) => exists)
    .map(([truth, sourceName]) => sourceName)

  sources.length > 1 &&
    error(`Conflicting Babel configurations: ${sources.join(', ')}`)

  const [source] = sources
  if (source) {
    const reconfig = {...config}
    const options = reconfig.module.rules[2].oneOf[1].options

    delete options.presets
    delete options.plugins

    switch (source) {
      case 'package.json "babel" field': {
        Object.assign(options, pkgBabel)
        break
      }
      case '.babelrc file': {
        options.babelrc = true
        break
      }
      case '.babelrc.js file':
      case '.babelrc.json file':
      case 'babel.config.js file': {
        const [fileName] = source.split(' ')
        const babelConfigPath = join(appPath, fileName)
        const babelConfig = require(babelConfigPath)
        Object.assign(options, babelConfig)
        break
      }
    }

    return reconfig
  }

  return config
}
