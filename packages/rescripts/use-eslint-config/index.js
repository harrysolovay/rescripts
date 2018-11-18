const {paths, existsInAppRoot, error} = require('@rescripts/utilities')
const {join} = require('path')

module.exports = config => {
  const {appPackageJson, appPath} = paths
  const {eslintConfig: pkgEslintConfig} = require(appPackageJson)

  const sources = [
    [!!pkgEslintConfig, 'package.json "eslintConfig" field'],
    [existsInAppRoot('.eslintrc'), '.eslintrc file'],
    [existsInAppRoot('.eslintrc.js'), '.eslintrc.js file'],
    [existsInAppRoot('.eslintrc.json'), '.eslintrc.json file'],
    [existsInAppRoot('eslint.config.js'), 'eslint.config.js file'],
  ]
    .filter(([exists]) => exists)
    .map(([truth, sourceName]) => sourceName)

  sources.length > 1 &&
    error(`Conflicting ESLint configurations: ${sources.join(', ')}`)

  const [source] = sources
  if (source) {
    const reconfig = {...config}
    const options = reconfig.module.rules[1].use[0].options

    options.baseConfig = {}

    switch (source) {
      case 'package.json "eslintConfig" field': {
        Object.assign(options.baseConfig, pkgEslintConfig)
        break
      }
      case '.eslintrc file': {
        options.useEslintrc = true
        break
      }
      case '.eslintrc.js file':
      case '.eslintrc.json file':
      case 'eslint.config.js file': {
        const [fileName] = source.split(' ')
        const eslintConfigPath = join(appPath, fileName)
        const eslintConfig = require(eslintConfigPath)
        Object.assign(options.baseConfig, eslintConfig)
        break
      }
    }

    return reconfig
  }

  return config
}
