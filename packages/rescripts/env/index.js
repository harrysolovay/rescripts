// const {map} = require('ramda')

module.exports = ({babel, eslint, tslint}) =>
  [
    babel && ['use-babel-config', babel],
    eslint && ['use-eslint-config', eslint],
    tslint && ['use-tslint-config', tslint],
  ].filter(Boolean)
