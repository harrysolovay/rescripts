const WebpackPWAManifestPlugin = require('webpack-pwa-manifest')

const manifestPluginProps = [
  'publicPath',
  'basePath',
  'fileName',
  'transformExtensions',
  'writeToFileEmit',
  'seed',
  'filter',
  'map',
  'generate',
  'sort',
  'serialize',
]

const isManifestPlugin = plugin => {
  const {opts} = plugin
  if (opts) {
    const keys = Object.keys(opts)
    if (manifestPluginProps.every(key => keys.includes(key))) {
      return true
    }
  }
  return false
}

module.exports = options => config => ({
  ...config,
  plugins: [
    ...config.plugins.filter(plugin => !isManifestPlugin(plugin)),
    new WebpackPWAManifestPlugin(options),
  ],
})
