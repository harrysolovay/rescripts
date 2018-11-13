if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production'
}

const {reactScriptsPath} = require('./utilities')

// retrieve Webpack config
const configPath = `${reactScriptsPath}/config/webpack.config.prod`
let config = require(configPath)

const {scanUserRc, scanUserConfig} = require('./scan')
// use Babel &/ ESLint config(s) if present
config = scanUserRc(config)
// use user config if present
config = scanUserConfig(config)

// monkeypatch
require.cache[require.resolve(configPath)].exports = config
require(`${reactScriptsPath}/scripts/build`)
