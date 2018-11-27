const {type} = require('ramda')
const {error} = require('@rescripts/utilities')

module.exports = (rewire, ...options) => {
  const needsLoading = type(rewire) === 'String'
  const loaded = (needsLoading && require(rewire)) || rewire

  type(loaded) !== 'Function' && error('NOPE')

  const {NODE_ENV} = process.env
  return config => loaded(config, NODE_ENV, ...options)
}
