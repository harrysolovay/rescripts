const {
  find,
  either,
  equals,
  type,
  reduce,
  assoc,
  reduceRight,
  mergeWith,
  flatten,
  includes,
} = require('ramda')
const {
  loadFromPackageField,
  loadRawFromRoot,
  loadFromRoot,
  error,
  load,
} = require('@rescripts/utilities')

const loadCustomConfig = path => 
  loadRawFromRoot(path) ||
  loadFromRoot(path) ||
  load(path) ||
  error(
    `Unable to load config file by provided path '${path}'`,
  )

const loadStandardConfig = () => 
  loadFromPackageField('rescripts') ||
  loadRawFromRoot('.rescriptsrc') ||
  loadFromRoot('.rescriptsrc') ||
  error(
    'You\'re likely seeing this bug because you haven\'t defined a root rescript or your root rescript contains a syntactical error. If you\'re certain of otherwise, please file an issue.',
  )

const rootRescript = (() => {
  const customConfigPath = find(
    either(equals('--config'), equals('-c')),
    process.argv,
  )

  const loaded = customConfigPath ? loadCustomConfig(customConfigPath) : loadStandardConfig()

  switch (type(loaded)) {
    case 'Function':
    case 'Object': {
      return [loaded]
    }
    default: {
      return loaded
    }
  }
})()

const normalizeLoaded = x =>
  type(x) === 'String'
    ? load(`@rescripts/rescript-${x}`) ||
      load(`rescript-${x}`) ||
      load(x) ||
      load(`@rescripts/${x}`) ||
      loadFromRoot(x)
    : x

const loadCreatorAndApplyArgs = ([creator, ...args]) =>
  normalizeLoaded(creator)(...args)

const normalize = r =>
  type(r) === 'Array' ? loadCreatorAndApplyArgs(r) : normalizeLoaded(r)

const mergePipes = reduceRight(mergeWith((x, y) => flatten([x, y])), {})

const isolate = (scope, o) =>
  reduce(
    (accumulator, key) =>
      o[key] ? assoc(key, o[key], accumulator) : accumulator,
    {},
    scope,
  )

const gatherPipes = (scope, rescript = rootRescript) =>
  reduce(
    (pipes, e) => {
      const r = normalize(e)
      const rType = type(r)

      switch (rType) {
        case 'Array': {
          if (r) {
            const gathered = gatherPipes(scope, r)
            return mergePipes([gathered, pipes])
          }
          return
        }

        case 'Function': {
          return includes('webpack', scope)
            ? mergePipes([{webpack: [r]}, pipes])
            : pipes
        }

        case 'Object': {
          const scoped = isolate(scope, r)
          return mergePipes([scoped, pipes])
        }

        default: {
          error(
            'It seems that your Rescripts configuration is invalid. Please refer to the docs or post an issue if you believe this to be an internal bug. Thank you!',
          )
          return
        }
      }
    },
    {},
    rescript,
  )

module.exports = gatherPipes
