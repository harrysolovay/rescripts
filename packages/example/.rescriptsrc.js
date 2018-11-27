const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const WebpackPWAManifestPlugin = require('webpack-pwa-manifest')

const webpack = config => {
  console.log('doing some webpack rescripting')
  return config
}

const webpackWithArgs = [
  (...args) => config => {
    console.log(`rescripting webpack using the following args: ${args}`)
    return config
  },
  'one',
  2,
  {t: {r: {e: 'e'}}},
]

const multiProcess = {
  webpack: config => {
    console.log('hi')
    return config
  },
  devServer: config => {
    console.log('hey')
    return config
  },
  jest: config => {
    console.log('hoe')
    return config
  },
}

const multiProcessWithArgs = [
  options => ({
    webpack: config => {
      console.log(`${options} webpack`)
      return config
    },
    devServer: config => {
      console.log(`${options} devServer`)
      return config
    },
    jest: config => {
      console.log(`${options} jest`)
      return config
    },
  }),
  'Was properly applied to',
]

const acceptableFormats = [
  webpack,
  webpackWithArgs,
  multiProcess,
  multiProcessWithArgs,
]

module.exports = [
  ['use-babel-config', '.babelrc.js'],
  ['use-eslint-config', '.eslintrc.js'],
  [
    'use-webpack-plugins',
    [
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
    ].filter(Boolean),
  ],
  [
    'use-rewire',
    'react-app-rewire-compression-plugin',
    {test: /\.js(\?.*)?$/i, cache: true},
  ],
  ...acceptableFormats,
  require.resolve('./another-rescript'),
]
