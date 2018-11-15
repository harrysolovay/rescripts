const noop = () => {}
const idf = arg => arg

const {join} = require('path')

const reactScriptsPaths = require(join(
  join(require.resolve('react-scripts/package.json'), '..'),
  'config/paths',
))

const {appPath, ownPath, appNodeModules} = reactScriptsPaths

const paths = {
  ...reactScriptsPaths,
  ownConfigsPath: join(ownPath, 'config'),
  ownScriptsPath: join(ownPath, 'scripts'),
}

const {existsSync} = require('fs')
const existsInAppRoot = fileName => existsSync(join(appPath, fileName))

const resolveRelativeOrNodeModule = pathOrName =>
  existsInAppRoot(pathOrName)
    ? join(appPath, pathOrName)
    : join(appNodeModules, pathOrName)

const compose = (...fns) => arg =>
  fns.reduce((accumulator, fn) => fn(accumulator), arg)

const monkeyPatch = (configPath, rescript) => {
  const config = require(configPath)
  const rescriptedConfig = rescript(config)
  require.cache[require.resolve(configPath)].exports = rescriptedConfig
}

const error = (messageOrFn, ...args) => {
  const message =
    typeof messageOrFn === 'function'
      ? messageOrFn(args)
      : typeof messageOrFn === 'string'
      ? messageOrFn
      : 'invalid argument passed to error'
  console.error(message)
  process.exit(1)
}

module.exports = {
  paths,
  existsInAppRoot,
  resolveRelativeOrNodeModule,
  compose,
  noop,
  idf,
  monkeyPatch,
  error,
}
