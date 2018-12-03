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

const postCSSLoaderPath = require.resolve('postcss-loader')
const isPostCSSLoader = propEq('loader', postCSSLoaderPath)
const getPostCSSPluginsLens = ({use}) => {
  const postCSSLoaderIndex = findIndex(isPostCSSLoader, use)
  return postCSSLoaderIndex >= 0
    ? lensPath(['use', postCSSLoaderIndex, 'options', 'plugins'])
    : false
}

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

const formatTransformMap = {
  css: addStyleLintPluginToPostCSSLoaders,
  scss: addStyleLintPluginToPostCSSLoaders,
  js: addStylelintCustomProcessorLoader,
}

module.exports = ({path, formats}) => config => {
  const resolved = resolveFromRootOrNodeModules(path)
  !resolved &&
    error(
      `Could not load StyleLint configuration '${path}' relative to your project root nor node_modules'`,
    )

  const transforms = map(key => formatTransformMap[key](resolved), formats)
  const transform = compose(...transforms)
  return transform(config)
}
