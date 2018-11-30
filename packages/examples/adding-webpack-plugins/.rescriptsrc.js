const {flip, append, over, lensProp, reduce, filter} = require('ramda')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const WebpackPWAManifestPlugin = require('webpack-pwa-manifest')

const reducer = flip(append)

module.exports = [
  over(
    lensProp('plugins'),
    reduce(
      reducer,
      filter(Boolean, [
        process.env.NODE_ENV === 'production' &&
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
        new WebpackBuildNotifierPlugin({
          title: 'Rescripted App',
          logo: require.resolve('./public/icon.png'),
          suppressSuccess: true,
        }),
      ]),
    ),
  ),
]
