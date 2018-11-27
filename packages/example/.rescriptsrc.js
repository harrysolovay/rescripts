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
  ['use-babel-config', '.babelrc'],
  ['use-eslint-config', '.eslintrc'],
  [
    'use-rewire',
    'react-app-rewire-compression-plugin',
    {test: /\.js(\?.*)?$/i, cache: true},
  ],
  ...acceptableFormats,
]
