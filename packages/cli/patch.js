const {
  has,
  partition,
  insertAll,
  identity,
  intersperse,
  flatten,
  compose,
  type,
} = require('ramda')

const isMiddleware = has('isMiddleware')

module.exports = (gathered, path) => {
  if (gathered) {
    const [middleware, transforms] =
      type(gathered) === 'Array'
        ? partition(isMiddleware, gathered)
        : [false, gathered]

    const padded = insertAll(1, transforms, [identity, identity])
    const middlewareApplied = middleware && intersperse(middleware, padded)
    const flattened = flatten(middlewareApplied || padded)
    const transform = compose(...flattened)

    const resolved = require.resolve(path)
    const config = require(resolved)
    const transformed =
      type(config) === 'Function'
        ? (...args) => {
            const original = config(...args)
            return transform(original)
          }
        : transform(config)
    require.cache[resolved].exports = transformed
  }
}
