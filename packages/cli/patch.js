const {
  insertAll,
  identity,
  flatten,
  intersperse,
  compose,
  type,
  partition,
  has,
} = require('ramda')

const isMiddleware = has('isMiddleware')

module.exports = (gathered, path) => {
  if (gathered) {
    const [middleware, transforms] = partition(isMiddleware, gathered)
    const padded = insertAll(1, transforms, [identity, identity])
    const middlewareApplied = middleware && intersperse(middleware, padded)
    const flattened = flatten(middlewareApplied || padded)
    const transform = compose(...flattened)

    const config = require(path)
    const transformed =
      type(config) === 'Function'
        ? (...args) => {
            const original = config(...args)
            return transform(original)
          }
        : transform(config)

    const resolved = require.resolve(path)
    require.cache[resolved].exports = transformed
  }
}
