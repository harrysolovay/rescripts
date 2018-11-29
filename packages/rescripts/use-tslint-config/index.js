const {resolveFromRootOrNodeModules} = require('@rescripts/utilities')
// const {assocPath} = require('ramda')

module.exports = path => config => {
  config.module.rules.unshift({
    test: /\.(ts|tsx)$/,
    enforce: 'pre',
    use: [
      {
        options,
        loader: require.resolve('tslint-loader'),
      },
    ],
    include: esLintLoader.include,
    exclude: esLintLoader.exclude,
  })
  return config
}
