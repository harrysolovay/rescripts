process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const composeRescripts = require('../composeRescripts')
const rootRescript = require('../rootRescript')
const [webpack] = composeRescripts(rootRescript, ['webpack'])

const {join} = require('path')
const {paths, monkeyPatch, createLogs} = require('@rescripts/utilities')
const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigPath = join(ownConfigsPath, 'webpack.config.prod')
const patchedWebpackConfig = monkeyPatch(webpackConfigPath, webpack)

const {writeLogsTo} = rootRescript[0]
if (writeLogsTo) {
  const {inspect} = require('util')
  createLogs(writeLogsTo, [
    {
      fileName: `webpack.config.prod.js`,
      contents: inspect(patchedWebpackConfig),
    },
  ])
}

require(join(ownScriptsPath, 'build'))
