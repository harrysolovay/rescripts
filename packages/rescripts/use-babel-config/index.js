const {paths, existsInAppRoot} = require('@rescripts/utilities')
const {appPackageJson} = paths
const {babel} = require(appPackageJson)

module.exports = {
  webpack: config => {
    const reconfig = {...config}
    const babelOptions = reconfig.module.rules[2].oneOf[1].options

    const clearBabelConfig = () => {
      delete babelOptions.presets
      delete babelOptions.plugins
    }

    if (babel) {
      // module resolution mapping?
      clearBabelConfig()
      Object.assign(babelOptions, babel)
    } else {
      for (let fileName of ['.babelrc', '.babelrc.js', 'babel.config.js']) {
        if (existsInAppRoot(fileName)) {
          switch (fileName) {
            case '.babelrc': {
              clearBabelConfig()
              babelOptions.babelrc = true
              break
            }
            case '.babelrc.js':
            case 'babel.config.js': {
              clearBabelConfig()
              const babelConfigPath = path.join(paths.appPath, fileName)
              const babelConfig = require(babelConfigPath)
              Object.assign(babelOptions, babelConfig)
              break
            }
            default: {
              break
            }
          }
        }
      }
    }

    return reconfig
  },
}
