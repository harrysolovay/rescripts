#!/usr/bin/env node

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const {reactScriptsPath} = require('./utilities')

// retrieve Webpack config
const configPath = `${reactScriptsPath}/config/webpack.config.dev`
let config = require(configPath)

// use Babel &/ ESLint config(s) if present
const {scanUserRc} = require('./scan')
config = scanUserRc(config)

// monkeypatch
require.cache[require.resolve(configPath)].exports = config
require(`${reactScriptsPath}/scripts/start`)
