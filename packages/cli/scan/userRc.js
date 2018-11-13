const {rootPath, existsInRoot} = require('../utilities')

module.exports = config => {
  const reconfig = {...config}

  // TODO: make selector package
  const babelOptions = reconfig.module.rules[2].oneOf[1].options
  const eslintOptions = reconfig.module.rules[1].use[0].options

  const clearBabelConfig = () => {
    delete babelOptions.presets
    delete babelOptions.plugins
  }

  const clearESLintConfig = () => {
    eslintOptions.baseConfig = {}
  }

  for (let fileName of ['.babelrc', '.babelrc.js', 'babel.config.js']) {
    if (existsInRoot(fileName)) {
      switch (fileName) {
        case '.babelrc': {
          clearBabelConfig()
          babelOptions.babelrc = true
          break
        }
        case '.babelrc.js':
        case 'babel.config.js': {
          clearBabelConfig()
          Object.assign(babelOptions, require(`${rootPath}/${fileName}`))
          break
        }
        default: {
          break
        }
      }
    }
  }

  for (let fileName of ['.eslintrc', '.eslintrc.js', 'eslint.config.js']) {
    if (existsInRoot(fileName)) {
      switch (fileName) {
        case '.eslintrc': {
          clearESLintConfig()
          eslintOptions.useEslintrc = true
          break
        }
        case '.eslintrc.js':
        case 'eslint.config.js': {
          clearESLintConfig()
          eslintOptions.baseConfig = require(`${rootPath}/${fileName}`)
          break
        }
        default: {
          break
        }
      }
    }
  }

  return reconfig
}
