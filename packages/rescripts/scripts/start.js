if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

const {reactScriptsPath} = require('../utilities')
const [babel, eslint] = require('./add-custom')

const webpackConfigDevPath = `${reactScriptsPath}/config/webpack.config.dev`
const webpackConfigDev = require(webpackConfigDevPath)

babel(webpackConfigDev)
eslint(webpackConfigDev)

require.cache[require.resolve(webpackConfigDevPath)].exports = webpackConfigDev
require(`${reactScriptsPath}/scripts/start`)
