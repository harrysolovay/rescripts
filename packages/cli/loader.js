const {
  findIndex,
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

const rootRescript = (() => {
  const configKeyI = findIndex(
    either(equals('--config'), equals('-c')),
    process.argv,
  )

  const loaded =
    configKeyI >= 0
      ? loadRawFromRoot(process.argv[configKeyI + 1]) ||
        loadFromRoot(process.argv[configKeyI + 1]) ||
        load(process.argv[configKeyI + 1])
      : loadFromPackageField('rescripts') ||
        loadRawFromRoot('.rescriptsrc') ||
        loadFromRoot('.rescriptsrc') ||
        error(
          "You're likely seeing this bug because you haven't defined a root rescript or your root rescript contains a syntactical error. If you're certain of otherwise, please file an issue.",
        )

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
