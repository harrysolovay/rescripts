const paths = require('./paths')
const selectors = require('./selectors')
const errors = require('./errors')

module.exports = {
  ...paths,
  ...selectors,
  ...errors,
}
