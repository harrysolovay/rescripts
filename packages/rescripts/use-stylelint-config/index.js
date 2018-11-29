const {
  findIndex,
  map,
  lensPath,
  over,
  propEq,
  append,
  includes,
  compose,
} = require('ramda')
const styleLint = require('styleLint')
const {resolveFromRootOrNodeModules, error} = require('@rescripts/utilities')

const postCSSLoaderPath = require.resolve('postcss-loader')
const isPostCSSLoader = propEq('loader', postCSSLoaderPath)
const getPostCSSPluginsLens = ({use}) => {
  if (!use) {
    return false
  }
  const postCSSLoaderIndex = findIndex(isPostCSSLoader, use)
  return postCSSLoaderIndex >= 0
    ? lensPath(['use', postCSSLoaderIndex, 'options', 'plugins'])
    : false
}

const addPostCSSStyleLintPlugin = path =>
  over(
    lensPath(['module', 'rules', 2, 'oneOf']),
    map(oneOf => {
      try {
        const lens = getPostCSSPluginsLens({configFile: path})
        return over(lens, fn => [...fn(), styleLint], oneOf)
      } catch (e) {
        return oneOf
      }
    }),
  )

// bug in 'stylelint-custom-processor-loader' configPath resolution
const addStylelintCustomProcessorLoader = over(
  lensPath(['module', 'rules', 1, 'use']),
  append({
    loader: 'stylelint-custom-processor-loader',
    options: {
      configPath: null,
      emitWarning: true,
    },
  }),
)

module.exports = ({path, formats}) => config => {
  const resolved = resolveFromRootOrNodeModules(path)
  const transforms = map(
    e => {
      const [format, transform] = e
      return includes(format, formats) && transform
    },
    [
      ['css', addPostCSSStyleLintPlugin(resolved)],
      ['js', addStylelintCustomProcessorLoader],
    ],
  ).filter(Boolean)
  const transform = compose(...transforms)
  return transform(config)
}
