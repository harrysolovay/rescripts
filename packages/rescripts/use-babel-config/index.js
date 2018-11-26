const {type, keys, reduce, assocPath, dissocPath} = require('ramda')
const {
  loadFromPackageField,
  loadFromNodeModulesOrRoot,
  error,
} = require('@rescripts/utilities')

const optionsPath = ['module', 'rules', 2, 'oneOf', 1, 'options']

const clearDefaults = webpackConfig =>
  reduce(
    (accumulator, key) => dissocPath([...optionsPath, key], accumulator),
    webpackConfig,
    ['presets', 'plugins'],
  )

const useBabelrc = webpackConfig =>
  assocPath([...optionsPath, 'babelrc'], true, clearDefaults(webpackConfig))

const useBabelConfig = (babelConfig, webpackConfig) =>
  reduce(
    (accumulator, key) =>
      assocPath([...optionsPath, key], babelConfig[key], webpackConfig),
    webpackConfig,
    keys(babelConfig),
  )

module.exports = options => webpackConfig => {
  switch (type(options)) {
    case 'String': {
      switch (options) {
        case '.babelrc': {
          return useBabelrc(webpackConfig)
        }
        case 'package':
        case 'package.json': {
          const babelConfig = loadFromPackageField('babel')
          return useBabelConfig(babelConfig, webpackConfig)
        }
        default: {
          const babelConfig = loadFromNodeModulesOrRoot(options)
          return useBabelConfig(babelConfig, webpackConfig)
        }
      }
    }
    case 'Object': {
      return useBabelConfig(options, webpackConfig)
    }
    default: {
      error('must specify babel config entry')
    }
  }
}
