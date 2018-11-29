const {findIndex, over, lensProp, remove, lensPath, insert} = require('ramda')
const {paths, resolveFromRootOrNodeModules} = require('@rescripts/utilities')
const {src} = paths

const isTSPlugin = ({constructor: {name}}) =>
  name === 'ForkTsCheckerWebpackPlugin'

const pluginsLens = lensProp('plugins')
const clearOfTSPlugin = config => {
  const {plugins} = config
  const pluginIndex = findIndex(isTSPlugin, plugins)
  const removePlugin = remove(pluginIndex, 1)
  return over(pluginsLens, removePlugin, config)
}

const addTSLintLoader = path =>
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
  const withoutPlugin = clearOfTSPlugin(config)
  const resolved = resolveFromRootOrNodeModules(path, withoutPlugin)
  return addTSLintLoader(resolved)(withoutPlugin)
}
