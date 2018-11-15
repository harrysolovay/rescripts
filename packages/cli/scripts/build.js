process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const compose = require('../compose')
const rootRescript = require('../rootRescript')
const [webpack] = compose(
  rootRescript,
  'webpack',
)

const {paths, monkeyPatch} = require('@rescripts/utilities')
const {join} = require('path')
const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigDevPath = join(ownConfigsPath, 'webpack.config.prod')
monkeyPatch(webpackConfigDevPath, webpack)

require(join(ownScriptsPath, 'build'))
