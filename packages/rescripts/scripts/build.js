if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'

const {reactScriptsPath} = require('../utilities')
const [babel, eslint] = require('./add-custom')

const webpackConfigProdPath = `${reactScriptsPath}/config/webpack.config.prod`
const webpackConfigProd = require(webpackConfigProdPath)

babel(webpackConfigProd)
eslint(webpackConfigProd)

require.cache[
	require.resolve(webpackConfigProdPath)
].exports = webpackConfigProd
require(`${reactScriptsPath}/scripts/build`)
