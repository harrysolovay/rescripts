const {
  getWebpackPlugin,
  appendWebpackPlugin,
  editWebpackPlugin,
  replaceWebpackPlugin,
  removeWebpackPlugin,
} = require('@rescripts/utilities')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const WebpackPWAManifestPlugin = require('webpack-pwa-manifest')

module.exports = [
  config => {
    getWebpackPlugin('ForkTsCheckerWebpackPlugin', config) &&
      console.log('TypeScript enabled')

    const appended = appendWebpackPlugin(
      new WebpackBuildNotifierPlugin({
        title: 'Rescripted App',
        logo: require.resolve('./public/icon.png'),
        suppressSuccess: true,
      }),
      config,
    )

    const edited = editWebpackPlugin(
      'DefinePlugin',
      p => {
        p.someOption = 'changed'
        return p
      },
      appended,
    )

    const replaced = replaceWebpackPlugin(
      'ManifestPlugin',
      new WebpackPWAManifestPlugin({
        name: 'Rescripted App',
        short_name: 'Example',
        description: 'An example app that uses Rescripts',
        background_color: '#fff',
        crossorigin: 'use-credentials',
        icons: [
          {
            src: require.resolve('./public/icon.png'),
            sizes: [96, 128, 192, 256, 384, 512],
          },
        ],
      }),
      edited,
    )

    const removed = removeWebpackPlugin('IgnorePlugin', replaced)

    return removed
  },
]
