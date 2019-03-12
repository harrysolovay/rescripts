const {
  allPass,
  prop,
  propSatisfies,
  includes,
  reduce,
  assocPath,
  dissocPath,
  __,
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

const isSrcBabelLoader = allPass([
  prop('loader'),
  propSatisfies(includes('babel-loader'), 'loader'),
  prop('include'),
])

const clearDefaults = reduce(
  (config, key) => dissocPath(['options', key], config),
  __,
  ['presets', 'plugins'],
)

const useDotRc = config =>
  assocPath(['options', 'babelrc'], true, clearDefaults(config))

const useConfigFile = (options, config) =>
  reduce(
    (stage, key) => assocPath(['options', key], options[key], stage),
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
            case '.babelrc': {
              return useDotRc(subConfig)
            }
            case 'package':
            case 'package.json': {
              const babelConfig = loadFromPackageField('babel')
              return useConfigFile(babelConfig, subConfig)
            }
            default: {
              const babelConfig = loadFromNodeModulesOrRoot(source)
              return useConfigFile(babelConfig, subConfig)
            }
          }
        }
        case 'Object': {
          return useConfigFile(source, subConfig)
        }
        default: {
          error(
            `@rescripts/rescript-use-babel-config expects argument of type 'String' or 'Object' but recieved ${sourceType}`,
          )
        }
      }
    },
    getPaths(isSrcBabelLoader, config),
    config,
  )

//
