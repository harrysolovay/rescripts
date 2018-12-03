const {
  type,
  keys,
  reduce,
  assocPath,
  dissocPath,
  includes,
  allPass,
  prop,
  propSatisfies,
  __,
} = require('ramda')
const {
  loadFromPackageField,
  loadFromNodeModulesOrRoot,
  error,
  edit,
} = require('@rescripts/utilities')

const clearDefaults = reduce((c, key) => dissocPath(['options', key], c), __, [
  'presets',
  'plugins',
])

const useDotRc = c => assocPath(['options', 'babelrc'], true, clearDefaults(c))

const useConfigFile = (babelConfig, c) =>
  reduce(
    (stage, key) => assocPath(['options', key], babelConfig[key], stage),
    clearDefaults(c),
    keys(babelConfig),
  )

module.exports = options =>
  edit(
    allPass([
      prop('loader'),
      propSatisfies(includes('babel-loader'), 'loader'),
      prop('include'),
    ]),
    c => {
      const optionsType = type(options)
      switch (optionsType) {
        case 'String': {
          switch (options) {
            case '.babelrc': {
              return useDotRc(c)
            }
            case 'package':
            case 'package.json': {
              const babelConfig = loadFromPackageField('babel')
              return useConfigFile(babelConfig, c)
            }
            default: {
              const babelConfig = loadFromNodeModulesOrRoot(options)
              return useConfigFile(babelConfig, c)
            }
          }
        }
        case 'Object': {
          return useConfigFile(options, c)
        }
        default: {
          error(
            `@rescripts/rescript-use-eslint-config expects argument of type 'String' or 'Object' but recieved ${optionsType}`,
          )
        }
      }
    },
  )
