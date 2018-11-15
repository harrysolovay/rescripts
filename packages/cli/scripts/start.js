process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const compose = require('../compose')
const rootRescript = require('../rootRescript')
const [webpack, devServer] = compose(
  rootRescript,
  'webpack',
  'devServer',
)

const {paths, monkeyPatch} = require('@rescripts/utilities')
const {join} = require('path')
const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigDevPath = join(ownConfigsPath, 'webpack.config.dev')
monkeyPatch(webpackConfigDevPath, webpack)

const devServerConfigPath = join(ownConfigsPath, 'webpackDevServer.config')
monkeyPatch(devServerConfigPath, devServer)

require(join(ownScriptsPath, 'start'))
