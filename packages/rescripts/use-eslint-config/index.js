const {existsInAppRoot} = require('@rescripts/utilities')

module.exports = {
  webpack: config => {
    const reconfig = {...config}
    const eslintOptions = reconfig.module.rules[1].use[0].options

    const clearESLintConfig = () => {
      eslintOptions.baseConfig = {}
    }

    for (let fileName of ['.eslintrc', '.eslintrc.js', 'eslint.config.js']) {
      if (existsInAppRoot(fileName)) {
        switch (fileName) {
          case '.eslintrc': {
            clearESLintConfig()
            eslintOptions.useEslintrc = true
            break
          }
          case '.eslintrc.js':
          case 'eslint.config.js': {
            clearESLintConfig()
            const eslintConfigPath = `${paths.appPath}/${fileName}`
            eslintOptions.baseConfig = require(eslintConfigPath)
            break
          }
          default: {
            break
          }
        }
      }
    }

    return reconfig
  },
}
