const {
  both,
  prop,
  propSatisfies,
  includes,
  reduce,
  assocPath,
  dissocPath,
  keys,
  type,
} = require('ramda')
const {
  loadFromPackageField,
  loadFromNodeModulesOrRoot,
  edit,
  getPaths,
  error,
} = require('@rescripts/utilities')

const isESLintLoader = both(
  prop('loader'),
  propSatisfies(includes('eslint-loader'), 'loader'),
)

const clearDefaults = dissocPath(['options', 'baseConfig'])

const useDotRc = config =>
  assocPath(['options', 'useEslintrc'], true, clearDefaults(config))

const useConfigFile = (options, config) =>
  reduce(
    (stage, key) =>
      assocPath(['options', 'baseConfig', key], options[key], stage),
    clearDefaults(config),
    keys(options),
  )

module.exports = source => config =>
  edit(
    subConfig => {
      const sourceType = type(source)
      switch (sourceType) {
        case 'String': {
          switch (source) {
            case '.eslintrc': {
              return useDotRc(subConfig)
            }
            case 'package':
            case 'package.json': {
              const eslintConfig = loadFromPackageField('eslintConfig') // ?
              return useConfigFile(eslintConfig, subConfig)
            }
            default: {
              const eslintConfig = loadFromNodeModulesOrRoot(source)
              return useConfigFile(eslintConfig, subConfig)
            }
          }
        }
        case 'Object': {
          return useConfigFile(source, subConfig)
        }
        default: {
          error(
            `@rescripts/rescript-use-eslint-config expects argument of type 'String' or 'Object' but recieved ${sourceType}`,
          )
        }
      }
    },
    getPaths(isESLintLoader, config),
    config,
  )
