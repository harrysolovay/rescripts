const {type} = require('ramda')
const {error} = require('@rescripts/utilities')

module.exports = (rewire, ...options) => {
  const needsLoading = type(rewire) === 'String'
  const loaded = (needsLoading && require(rewire)) || rewire

  type(loaded) !== 'Function' &&
    error(
      "@rescripts/rescript-use-rewire expects first argument to be of type 'string' (a valid rewire module name or root-relative path) or 'function' (a valid webpack rewire)",
    )

  const {NODE_ENV} = process.env
  return config => loaded(config, NODE_ENV, ...options)
}
