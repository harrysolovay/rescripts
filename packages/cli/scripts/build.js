process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const composeRescripts = require('../composeRescripts')
const rootRescript = require('../rootRescript')
const {paths, createLogs} = require('@rescripts/utilities')
const {join} = require('path')
const monkeyPatch = require('../monkeyPatch')

const [webpack] = composeRescripts(rootRescript, ['webpack'])

const {ownConfigsPath, ownScriptsPath} = paths

const webpackConfigPath = join(ownConfigsPath, 'webpack.config.prod')
const patchedWebpackConfig = monkeyPatch(webpackConfigPath, webpack)

const {logs} = rootRescript[0]

if (logs) {
  const {inspect} = require('util')
  createLogs(logs, [
    {
      fileName: `webpack.config.prod.js`,
      contents: inspect(patchedWebpackConfig),
    },
  ])
}

require(join(ownScriptsPath, 'build'))
