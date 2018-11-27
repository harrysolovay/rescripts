const {reduce, keys, pipe} = require('ramda')
const reactScriptsPaths = require('react-scripts/config/paths')
const {join} = require('path')
const {readFileSync} = require('fs')

const rekeyMap = {
  dotenv: 'env',
  appPath: 'root',
  appBuild: 'build',
  appPublic: 'public',
  appHtml: 'html',
  appIndexJs: 'index',
  appPackageJson: 'package',
  appSrc: 'src',
  appTsConfig: 'tsconfig',
  yarnLockFile: 'lock',
  testsSetup: 'setupTests',
  proxySetup: 'setupProxy',
  appNodeModules: 'nodeModules',
  publicUrl: 'publicUrl',
  servedPath: 'served',
  ownPath: 'reactScripts',
  ownNodeModules: 'reactScriptsNodeModules',
  appTypeDeclarations: 'typeDefinitions',
  ownTypeDeclarations: 'reactScriptsTypeDefinitions',
  moduleFileExtensions: 'extensions',
}

const configs = {
  webpackConfigDev: 'config/webpack.config.dev',
  webpackConfigProd: 'config/webpack.config.prod',
  webpackDevServerConfig: 'config/webpackDevServer.config',
  createJestConfig: 'scripts/utils/createJestConfig',
}

const scripts = ['start', 'build', 'test']

const paths = {
  // improve path key names
  ...reduce(
    (accumulator, key) => ({
      ...accumulator,
      [rekeyMap[key]]: reactScriptsPaths[key],
    }),
    {},
    keys(reactScriptsPaths),
  ),

  // configurations
  ...reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: join(reactScriptsPaths.ownPath, configs[key]),
    }),
    {},
    keys(configs),
  ),

  // scripts
  ...reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: join(reactScriptsPaths.ownPath, 'scripts', key),
    }),
    {},
    scripts,
  ),
}

const makeSafe = loader => p => {
  try {
    return loader(p)
  } catch (e) {
    return null
  }
}
const load = makeSafe(p => require(p))
const loadRaw = makeSafe(p => {
  const raw = readFileSync(p)
  return JSON.parse(raw)
})

const createFrom = (resolver, prefix) =>
  pipe(
    m => join(prefix, m),
    resolver,
  )
const {root, reactScriptsNodeModules} = paths
const loadFromRoot = createFrom(load, root)
const resolveFromRoot = createFrom(require.resolve, root)
const loadRawFromRoot = createFrom(loadRaw, root)
const loadFromNodeModulesOrRoot = m => load(m) || loadFromRoot(m)
const loadFromPackageField = field => loadFromRoot('package')[field]
const loadFromReactScriptsNodeModules = createFrom(
  load,
  reactScriptsNodeModules,
)

module.exports = {
  paths,
  load,
  loadRaw,
  loadFromRoot,
  loadRawFromRoot,
  loadFromNodeModulesOrRoot,
  loadFromPackageField,
  loadFromReactScriptsNodeModules,
}
