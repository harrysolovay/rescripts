if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test'
}

const {reactScriptsPath, existsInRoot} = require('./utilities')
const babelJest = require('babel-jest')

const configPath = `${reactScriptsPath}/config/jest/babelTransform`
const config = (() => {
  for (let fileName of ['.babelrc', '.babelrc.js', 'babel.config.js']) {
    if (existsInRoot(fileName)) {
      switch (fileName) {
        case '.babelrc': {
          return babeJest.createTransformer({
            babelrc: true,
            configFile: false,
          })
        }
        case '.babelrc.js':
        case 'babel.config.js': {
          return babelJest.createTransformer(
            Object.assign(
              {
                babelrc: false,
                configFile: false,
              },
              require(`${rootPath}/${fileName}`),
            ),
          )
        }
        default:
          return require(configPath)
      }
    }
  }
})()

require.cache[require.resolve(configPath)].exports = config
require(`${reactScriptsPath}/scripts/test`)
