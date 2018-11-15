// TODO: make jest configurable

process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'
process.env.PUBLIC_URL = ''

const compose = require('../compose')
const rootPreset = require('../rootPreset')

const [webpack, devServer] = compose(
  rootPreset,
  ['jest'],
)

const {paths, monkeyPatch} = require('@rescripts/utilities')

const {join} = require('path')
const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigDevPath = join(ownConfigsPath, '...NOOOOO')
monkeyPatch(webpackConfigDevPath, webpack)

const devServerConfigPath = join(ownConfigsPath, 'webpackDevServer.config')
monkeyPatch(devServerConfigPath, devServer)

require(join(ownScriptsPath, 'test'))
