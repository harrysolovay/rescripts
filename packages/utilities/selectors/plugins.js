const {
  curry,
  lensProp,
  lensPath,
  over,
  prepend,
  append,
  findIndex,
  remove,
  assocPath,
} = require('ramda')

const {error} = require('../errors')

const pluginsLens = lensProp('plugins')

const getPluginIndex = curry((constructorName, {plugins}) => {
  const isMatch = ({constructor: {name}}) => name === constructorName
  return findIndex(isMatch, plugins)
})

const injectPluginIndex = curry((constructorName, fn, config) => {
  const i = getPluginIndex(constructorName, config)
  i === -1 &&
    error(`No plugin with constructor name ${constructorName} was found`)
  return fn(i)
})

const getWebpackPlugin = curry((constructorName, config) => {
  const i = getPluginIndex(constructorName, config)
  return i >= 0 ? config.plugins[i] : null
})

const prependWebpackPlugin = curry((plugin, config) =>
  over(pluginsLens, prepend(plugin), config),
)

const appendWebpackPlugin = curry((plugin, config) =>
  over(pluginsLens, append(plugin), config),
)

const editWebpackPlugin = curry((transform, constructorName, config) =>
  injectPluginIndex(
    constructorName,
    i => {
      const pluginLens = lensPath(['plugins', i])
      return over(pluginLens, transform, config)
    },
    config,
  ),
)

const replaceWebpackPlugin = curry((replacement, constructorName, config) =>
  injectPluginIndex(
    constructorName,
    i => assocPath(['plugins', i], replacement, config),
    config,
  ),
)

const removeWebpackPlugin = curry((constructorName, config) =>
  injectPluginIndex(
    constructorName,
    i => over(pluginsLens, remove(i, 1), config),
    config,
  ),
)

module.exports = {
  getWebpackPlugin,
  prependWebpackPlugin,
  appendWebpackPlugin,
  editWebpackPlugin,
  replaceWebpackPlugin,
  removeWebpackPlugin,
}
