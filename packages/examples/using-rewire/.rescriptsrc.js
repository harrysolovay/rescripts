module.exports = [
  [
    'use-rewire',
    'react-app-rewire-compression-plugin',
    {test: /\.js(\?.*)?$/i, cache: true},
  ],
  {
    webpack: config => {
      console.log('blammo')
      return config
    },
    devServer: config => {
      console.log('blammo')
      return config
    },
    jest: config => {
      console.log('blammo')
      return config
    },
  },
]
