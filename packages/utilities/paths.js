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
  webpackConfig: 'config/webpack.config',
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
const resolve = makeSafe(p => {
  try {
    return require.resolve(p)
  } catch (error) {
    return null
  }
})

const createFromLoader = (loader, prefix) =>
  pipe(
    m => join(prefix, m),
    loader,
  )

const {root, reactScriptsNodeModules} = paths
const loadFromRoot = createFromLoader(load, root)
const loadRawFromRoot = createFromLoader(loadRaw, root)
const loadFromNodeModulesOrRoot = m => load(m) || loadFromRoot(m)
const loadFromPackageField = field => loadFromRoot('package')[field]
const loadFromReactScriptsNodeModules = createFromLoader(
  load,
  reactScriptsNodeModules,
)

const resolveFromRoot = createFromLoader(resolve, root)
const resolveFromRootOrNodeModules = m => resolveFromRoot(m) || resolve(m)
const resolveFromReactScriptsNodeModules = createFromLoader(
  resolve,
  reactScriptsNodeModules,
)
const resolveFromReactScriptsNMOrNM = m =>
  resolve(m) || resolveFromReactScriptsNodeModules(m)

module.exports = {
  paths,
  load,
  loadRaw,
  resolve,
  loadFromRoot,
  loadRawFromRoot,
  loadFromNodeModulesOrRoot,
  loadFromPackageField,
  loadFromReactScriptsNodeModules,
  resolveFromRoot,
  resolveFromRootOrNodeModules,
  resolveFromReactScriptsNodeModules,
  resolveFromReactScriptsNMOrNM,
}
