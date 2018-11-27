const {
  pipe,
  insert,
  __,
  identity,
  flatten,
  intersperse,
  compose,
  type,
} = require('ramda')

const normalize = pipe(
  insert(1, __, [identity, identity]),
  flatten,
)

module.exports = (transforms, path, middleware) => {
  if (transforms) {
    const normalized = normalize(transforms)
    const middlewareApplied = middleware && intersperse(middleware, normalized)
    const transform = compose(...(middlewareApplied || normalized))

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
