const {
  findIndex,
  over,
  lensProp,
  remove,
  lensPath,
  insert,
  type,
  pipe,
} = require('ramda')
const {
  paths,
  resolveFromRootOrNodeModules,
  error,
} = require('@rescripts/utilities')
const {src} = paths

const isTSPlugin = ({constructor: {name}}) =>
  name === 'ForkTsCheckerWebpackPlugin'

const pluginsLens = lensProp('plugins')

const clearOfTSPlugin = config => {
  const pluginIndex = findIndex(isTSPlugin, config.plugins)
  const removePlugin = remove(pluginIndex, 1)
  return over(pluginsLens, removePlugin, config)
}

const createAddTSLintLoader = path =>
  over(
    lensPath(['module', 'rules']),
    insert(1, {
      test: /\.(ts|tsx)$/,
      enforce: 'pre',
      use: [
        {
          options: {
            configFile: path,
            typeCheck: true,
            tsConfigFile: 'tsconfig.json',
            emitErrors: true,
            failOnHint: true,
          },
          loader: require.resolve('tslint-loader'),
        },
      ],
      include: src,
    }),
  )

module.exports = path => config => {
  const pathType = type(path)
  pathType !== 'String' &&
    error(
      `@rescripts/rescript-use-tslint-config expects argument of type 'string' but recieved ${pathType}`,
    )

  const resolved = resolveFromRootOrNodeModules(path)
  !resolved &&
    error(
      `Could not load TSLint configuration '${path}' relative to your project root nor node_modules'`,
    )

  const addTSLintLoader = createAddTSLintLoader(resolved)

  return pipe(
    clearOfTSPlugin,
    addTSLintLoader,
  )(config)
}
