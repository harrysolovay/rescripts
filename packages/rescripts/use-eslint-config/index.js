const {keys, type, reduce, assocPath, dissocPath} = require('ramda')
const {
  loadFromPackageField,
  loadFromNodeModulesOrRoot,
  error,
} = require('@rescripts/utilities')

const optionsPath = ['module', 'rules', 1, 'use', 0, 'options']

const clearDefaults = webpackConfig =>
  dissocPath([...optionsPath, 'baseConfig'], webpackConfig)

const useEslintrc = webpackConfig =>
  assocPath([...optionsPath, 'useEslintrc'], true, clearDefaults(webpackConfig))

const useEslintConfig = (eslintConfig, webpackConfig) =>
  reduce(
    (accumulator, key) =>
      assocPath([...optionsPath, key], eslintConfig[key], webpackConfig),
    webpackConfig,
    keys(eslintConfig),
  )

module.exports = options => webpackConfig => {
  switch (type(options)) {
    case 'String': {
      switch (options) {
        case '.eslintrc': {
          return useEslintrc(webpackConfig)
        }
        case 'package':
        case 'package.json': {
          const eslintConfig = loadFromPackageField('eslintConfig')
          return useEslintConfig(eslintConfig, webpackConfig)
        }
        default: {
          const eslintConfig = loadFromNodeModulesOrRoot(options)
          return useEslintConfig(eslintConfig, webpackConfig)
        }
      }
    }
    case 'Object': {
      return useEslintConfig(options, webpackConfig)
    }
    default: {
      error('must specify eslint config entry')
    }
  }
}
