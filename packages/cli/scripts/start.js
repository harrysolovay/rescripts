process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const buildTree = require('../buildTree')
const rootRescript = require('../rootRescript')
const {paths, createLogs} = require('@rescripts/utilities')
const {join} = require('path')
const monkeyPatch = require('../monkeyPatch')

const [webpack, devServer] = buildTree(rootRescript, ['webpack', 'devServer'])

const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigPath = join(ownConfigsPath, 'webpack.config.dev')
const patchedWebpackConfig = monkeyPatch(webpackConfigPath, webpack)

const devServerConfigPath = join(ownConfigsPath, 'webpackDevServer.config')
const patchedDevServerConfig = monkeyPatch(devServerConfigPath, devServer)

const {logs} = rootRescript[0]

if (logs) {
  const {inspect} = require('util')
  createLogs(logs, [
    {
      fileName: `webpack.config.dev.js`,
      contents: inspect(patchedWebpackConfig),
    },
    {
      fileName: `webpackDevServer.config.js`,
      contents: String(patchedDevServerConfig),
    },
  ])
}

require(join(ownScriptsPath, 'start'))
