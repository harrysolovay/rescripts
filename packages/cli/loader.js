const {
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

const rootRescript =
  loadFromPackageField('rescripts') ||
  loadRawFromRoot('.rescriptsrc') ||
  loadFromRoot('.rescriptsrc') ||
  error('UNABLE TO LOAD ROOT RESCRIPT')

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

const isolate = (scope, o) =>
  reduce(
    (accumulator, key) =>
      o[key] ? assoc(key, o[key], accumulator) : accumulator,
    {},
    scope,
  )

const mergePipes = reduceRight(mergeWith((x, y) => flatten([x, y])), {})

module.exports = (scope, rescript = rootRescript) =>
  rescript &&
  reduce(
    (pipes, e) => {
      const r = normalize(e)
      const rType = type(r)

      switch (rType) {
        case 'Array': {
          if (r) {
            const gathered = gatherPipes(scope, r)
            return mergePipes([pipes, gathered])
          }
          return
        }

        case 'Function': {
          return includes('webpack', scope)
            ? mergePipes([pipes, {webpack: r}])
            : pipes
        }

        case 'Object': {
          const scoped = isolate(scope, r)
          return mergePipes([pipes, scoped])
        }

        default: {
          error('invalid config')
          return
        }
      }
    },
    {},
    rescript,
  )
