const {flatten, identity, intersperse, pipe, type} = require('ramda')

const normalize = transformations => flatten([transformations, identity])

const applyMiddleware = (middleware, transformations) =>
  middleware ? intersperse(middleware, transformations) : transformations

const static = (transform, config) => transform(config)

const runtime = (transform, config) => (...args) => {
  const original = config(...args)
  return transform(original)
}

module.exports = (transformations, modulePath, middleware = false) => {
  if (transformations) {
    const normalized = normalize(transformations)
    const withMiddleware = applyMiddleware(middleware, normalized)
    const compositeTransform = pipe(...withMiddleware)
    const config = require(modulePath)

    const applyTransform = type(config) === 'Function' ? runtime : static
    const transformed = applyTransform(compositeTransform, config)

    require.cache[require.resolve(modulePath)].exports = transformed
  }
}
