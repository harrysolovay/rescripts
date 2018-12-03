const {
  propEq,
  findIndex,
  lensPath,
  map,
  prepend,
  compose,
  allPass,
  prop,
  propSatisfies,
  includes,
  assoc,
  init,
  both,
} = require('ramda')
const styleLint = require('styleLint')
const {
  resolveFromRootOrNodeModules,
  getPaths,
  edit,
  error,
} = require('@rescripts/utilities')

const isPostCSSOptions = allPass([
  prop('ident'),
  propSatisfies(includes('postcss'), 'ident'),
  prop('plugins'),
])

const addStyleLintPluginToPostCSSLoaders = path => config =>
  edit(
    subConfig => {
      const {plugins} = subConfig
      return assoc(
        'plugins',
        () => [styleLint({configFile: path}), ...plugins()],
        subConfig,
      )
    },
    getPaths(isPostCSSOptions, config),
    config,
  )

// bug in 'stylelint-custom-processor-loader' configPath resolution
const isESLintLoader = both(
  prop('loader'),
  propSatisfies(includes('eslint-loader'), 'loader'),
)

const addStylelintCustomProcessorLoader = path => config =>
  edit(
    prepend({
      loader: require.resolve('stylelint-custom-processor-loader'),
      options: {
        configPath: null,
        emitWarning: true,
      },
    }),
    map(init, getPaths(isESLintLoader, config)),
    config,
  )

module.exports = path => config => {
  const resolved = resolveFromRootOrNodeModules(path)
  !resolved &&
    error(
      `Could not load StyleLint configuration '${path}' relative to your project root nor node_modules'`,
    )

  const transforms = map(fn => fn(resolved), [
    addStyleLintPluginToPostCSSLoaders,
    addStylelintCustomProcessorLoader,
  ])
  const transform = compose(...transforms)
  return transform(config)
}
