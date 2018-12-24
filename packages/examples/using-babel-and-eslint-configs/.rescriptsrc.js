module.exports = [
  ['use-babel-config', '.babelrc.js'],
  ['use-eslint-config', '.eslintrc.js'],
  Object.assign(
    config => {
      console.log('middleware')
      return config
    },
    {isMiddleware: true},
  ),
]
