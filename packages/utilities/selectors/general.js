const {
  reduce,
  type,
  toPairs,
  map,
  lensPath,
  over,
  curry,
  assocPath,
  dissocPath,
} = require('ramda')

const isObjectOrArray = inQuestion =>
  type(inQuestion) === 'Array' || type(inQuestion) === 'Object'

const getPaths = curry((predicate, parentValue, parentPath = []) =>
  reduce(
    (paths, [key, value]) => {
      if (value) {
        const asCorrectType = isNaN(key) ? key : Number(key)
        const currentPath = [...parentPath, asCorrectType]
        return predicate(value)
          ? [...paths, currentPath]
          : isObjectOrArray(value)
          ? [...paths, ...getPaths(predicate, value, currentPath)]
          : paths
      }
      return paths
    },
    [],
    toPairs(parentValue),
  ),
)

const edit = curry((transform, paths, config) =>
  reduce(
    (configStage, lens) => over(lens, c => transform(c), configStage),
    config,
    map(lensPath, paths),
  ),
)

const replace = curry((replacement, paths, config) =>
  reduce(
    (configStage, path) => assocPath(path, replacement, configStage),
    config,
    paths,
  ),
)

const remove = curry((paths, config) =>
  reduce((configStage, path) => dissocPath(path, configStage), config, paths),
)

module.exports = {
  getPaths,
  edit,
  replace,
  remove,
}
