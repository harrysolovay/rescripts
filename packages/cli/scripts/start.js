process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const composeRescripts = require('../composeRescripts')
const rootRescript = require('../rootRescript')
const [webpack, devServer] = composeRescripts(rootRescript, [
  'webpack',
  'devServer',
])

const {join} = require('path')
const {paths, monkeyPatch, createLogs} = require('@rescripts/utilities')
const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigPath = join(ownConfigsPath, 'webpack.config.dev')
const patchedWebpackConfig = monkeyPatch(webpackConfigPath, webpack)

const devServerConfigPath = join(ownConfigsPath, 'webpackDevServer.config')
const patchedDevServerConfig = monkeyPatch(devServerConfigPath, devServer)

const {writeLogsTo} = rootRescript[0]
if (writeLogsTo) {
  const {inspect} = require('util')
  createLogs(writeLogsTo, [
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
