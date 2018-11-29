const {paths, resolveFromRootOrNodeModules} = require('@rescripts/utilities')
const {src} = paths
// const {assocPath} = require('ramda')

module.exports = path => config => {
  config.module.rules.splice(1, 0, {
    test: /\.(ts|tsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          configFile: resolveFromRootOrNodeModules(path),
          typeCheck: true,
          tsConfigFile: 'tsconfig.json',
          emitErrors: true,
          failOnHint: true,
        },
        loader: require.resolve('tslint-loader'),
      },
    ],
    include: src,
  })
  return config
}
