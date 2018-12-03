const {reduce, type, toPairs, map, lensPath, over, curry} = require('ramda')

const isObjectOrArray = inQuestion =>
  type(inQuestion) === 'Array' || type(inQuestion) === 'Object'

const getPath = (predicate, parentValue, parentPath = []) =>
  reduce(
    (paths, [key, value]) => {
      if (value) {
        const asCorrectType = isNaN(key) ? key : Number(key)
        const currentPath = [...parentPath, asCorrectType]
        return predicate(value)
          ? [...paths, currentPath]
          : isObjectOrArray(value)
          ? [...paths, ...getPath(predicate, value, currentPath)]
          : paths
      }
      return paths
    },
    [],
    toPairs(parentValue),
  )

const edit = curry((predicate, transform, config) => {
  const paths = getPath(predicate, config)
  const lenses = map(lensPath, paths)
  return reduce(
    (configStage, lens) => over(lens, c => transform(c), configStage),
    config,
    lenses,
  )
})

module.exports = {
  edit,
}
