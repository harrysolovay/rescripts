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

const useDotRc = webpackConfig =>
  assocPath([...optionsPath, 'babelrc'], true, clearDefaults(webpackConfig))

const useConfigFile = (babelConfig, webpackConfig) =>
  reduce(
    (accumulator, key) =>
      assocPath([...optionsPath, key], babelConfig[key], webpackConfig),
    clearDefaults(webpackConfig),
    keys(babelConfig),
  )

module.exports = options => webpackConfig => {
  switch (type(options)) {
    case 'String': {
      switch (options) {
        case '.babelrc': {
          return useDotRc(webpackConfig)
        }
        case 'package':
        case 'package.json': {
          const babelConfig = loadFromPackageField('babel')
          return useConfigFile(babelConfig, webpackConfig)
        }
        default: {
          const babelConfig = loadFromNodeModulesOrRoot(options)
          return useConfigFile(babelConfig, webpackConfig)
        }
      }
    }
    case 'Object': {
      return useConfigFile(options, webpackConfig)
    }
    default: {
      error('must specify babel config entry')
    }
  }
}
