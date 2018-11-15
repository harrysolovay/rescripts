const noop = () => {}
const idf = arg => arg

const {join} = require('path')

const reactScriptsPaths = require(join(
  join(require.resolve('react-scripts/package.json'), '..'),
  'config/paths',
))

const {ownPath} = reactScriptsPaths

const paths = {
  ...reactScriptsPaths,
  ownConfigsPath: join(ownPath, 'config'),
  ownScriptsPath: join(ownPath, 'scripts'),
}

const {existsSync} = require('fs')
const {appPath} = paths
const existsInAppRoot = fileName => existsSync(join(appPath, fileName))

const compose = (...fns) => arg =>
  fns.reduce((accumulator, fn) => fn(accumulator), arg)

const monkeyPatch = (configPath, rescript) => {
  const config = require(configPath)
  const rescriptedConfig = rescript(config)
  require.cache[require.resolve(configPath)].exports = rescriptedConfig
}

module.exports = {
  paths,
  existsInAppRoot,
  compose,
  noop,
  idf,
  monkeyPatch,
}
