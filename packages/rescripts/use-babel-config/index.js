const {join} = require('path')
const {paths, existsInAppRoot, error} = require('@rescripts/utilities')
const {appPackageJson} = paths
const pkg = require(appPackageJson)

const sources = [
  [!!pkg.babel, 'package.json "babel" field'],
  [existsInAppRoot('.babelrc'), '.babelrc file'],
  [existsInAppRoot('.babelrc.js'), '.babelrc.js file'],
  [existsInAppRoot('babel.config.js'), 'babel.config.js file'],
]
  .filter(([exists]) => exists)
  .map(([truth, sourceName]) => sourceName)

const ERROR_MESSAGE = `Conflicting Babel configurations: ${sources.join(', ')}`
sources.length > 1 && error(ERROR_MESSAGE)

module.exports = {
  webpack: config => {
    const reconfig = {...config}
    const options = reconfig.module.rules[2].oneOf[1].options

    const [source] = sources
    if (source) {
      delete options.presets
      delete options.plugins

      switch (source) {
        case 'package.json "babel" field': {
          Object.assign(options, babel)
          break
        }
        case '.babelrc file': {
          options.babelrc = true
          break
        }
        case '.babelrc.js file':
        case 'babel.config.js file': {
          const [fileName] = source.split(' ')
          const babelConfigPath = join(paths.appPath, fileName)
          const babelConfig = require(babelConfigPath)
          Object.assign(options, babelConfig)
        }
      }
    }

    return reconfig
  },
}
