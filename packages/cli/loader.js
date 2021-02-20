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
  exitWithError,
  load,
} = require('@rescripts/utilities')

const errorReporter = (error) => {
  if (error.code !== "ENOENT" && error.code !== "MODULE_NOT_FOUND") {
    console.log(error);
  }
}

const rootRescript = (() => {
  const configKeyI = findIndex(
    either(equals('--config'), equals('-c')),
    process.argv,
  )

  const loaded =
    (configKeyI >= 0
      ? loadRawFromRoot(process.argv[configKeyI + 1], errorReporter) ||
        loadFromRoot(process.argv[configKeyI + 1], errorReporter) ||
        load(process.argv[configKeyI + 1], errorReporter)
      : loadFromPackageField('rescripts') ||
        loadRawFromRoot('.rescriptsrc', errorReporter) ||
        loadFromRoot('.rescriptsrc', errorReporter)) ||
        exitWithError(
          "Rescripts ran into an error. Either your root rescript isn't defined or it contains syntactical errors. If you're certain of otherwise, please file an issue.",
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
          exitWithError(
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
