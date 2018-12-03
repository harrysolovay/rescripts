const {
  paths,
  resolveFromRootOrNodeModules,
  error,
  removeWebpackPlugin,
  edit,
} = require('@rescripts/utilities')
const {prepend} = require('ramda')

const clearOfTSPlugin = config =>
  removeWebpackPlugin('ForkTsCheckerWebpackPlugin', config)

const addTSLintLoader = (path, config) =>
  edit(
    prepend({
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
      include: paths.src,
    }),
    [['module', 'rules']],
    clearOfTSPlugin(config),
  )

module.exports = path => config => {
  const resolved = resolveFromRootOrNodeModules(path)
  !resolved &&
    error(
      `Could not load TSLint configuration '${path}' relative to your project root nor node_modules'`,
    )
  return addTSLintLoader(resolved, config)
}
