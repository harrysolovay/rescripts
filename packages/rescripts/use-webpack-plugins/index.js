const {addWebpackPlugin} = require('@rescripts/utilities')

module.exports = pluginInstances => config =>
  addWebpackPlugin(pluginInstances, config)
