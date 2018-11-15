process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const compose = require('../compose')
const rootPreset = require('../rootPreset')

const [webpack] = compose(
  rootPreset,
  ['webpack'],
)

const {paths, monkeyPatch} = require('@rescripts/utilities')

const {join} = require('path')
const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigDevPath = join(ownConfigsPath, 'webpack.config.prod')
monkeyPatch(webpackConfigDevPath, webpack)

require(join(ownScriptsPath, 'build'))
