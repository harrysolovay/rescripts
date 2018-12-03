const {
  lensProp,
  lensPath,
  over,
  prepend,
  append,
  findIndex,
  remove,
  assocPath,
} = require('ramda')
const {error} = '@rescripts/utilities'

const pluginsLens = lensProp('plugins')

const getPluginIndex = (constructorName, {plugins}) => {
  const isMatch = ({constructor: {name}}) => name === constructorName
  return findIndex(isMatch, plugins)
}

const injectPluginIndex = (constructorName, fn, config) => {
  const i = getPluginIndex(constructorName, config)
  i === -1 &&
    error(`No plugin with constructor name ${constructorName} was found`)
  return fn(i)
}

const getWebpackPlugin = (constructorName, config) => {
  const i = getPluginIndex(constructorName, config)
  return i >= 0 ? config.plugins[i] : null
}

const prependWebpackPlugin = (plugin, config) =>
  over(pluginsLens, prepend(plugin), config)

const appendWebpackPlugin = (plugin, config) =>
  over(pluginsLens, append(plugin), config)

const editWebpackPlugin = (constructorName, transform, config) =>
  injectPluginIndex(
    constructorName,
    i => {
      const pluginLens = lensPath(['plugins', i])
      return over(pluginLens, transform, config)
    },
    config,
  )

const replaceWebpackPlugin = (constructorName, replacement, config) =>
  injectPluginIndex(
    constructorName,
    i => assocPath(['plugins', i], replacement, config),
    config,
  )

const removeWebpackPlugin = (constructorName, config) =>
  injectPluginIndex(
    constructorName,
    i => over(pluginsLens, remove(i, 1), config),
    config,
  )

module.exports = {
  getWebpackPlugin,
  prependWebpackPlugin,
  appendWebpackPlugin,
  editWebpackPlugin,
  replaceWebpackPlugin,
  removeWebpackPlugin,
}
