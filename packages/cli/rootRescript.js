const {
  paths,
  resolveRelativeOrNodeModule,
  existsInAppRoot,
  error,
} = require('@rescripts/utilities')
const {appPath, appPackageJson} = paths
const {rescripts: pkgRescripts} = require(appPackageJson)
const {join} = require('path')

const normalizeRescriptsField = source => {
  if (typeof source === 'string') {
    // forwards to a single rescript
    return require(resolveRelativeOrNodeModule(source))
  } else if (Array.isArray(source)) {
    // resolve & require rescripts
    return source.map(rescript => {
      if (typeof rescript === 'string') {
        // pkgRescripts[x] is a path
        return require(resolveRelativeOrNodeModule(rescript))
      } else if (Array.isArray(rescript)) {
        // pkgRescripts[x] is [a path, options]
        if (typeof rescript[0] === 'string') {
          return [
            require(resolveRelativeOrNodeModule(rescript[0])),
            rescript[1],
          ]
        } else {
          error('invalid configuration in package.json')
        }
      } else {
        error('invalid configuration in package.json')
      }
    })
  } else if (typeof source === 'function') {
    return source
  } else {
    // Don't define rescript fns inside of the "rescripts" field
    error(`Invalid configuration`)
  }
}

const normalizeRescript = source => {
  if (typeof source === 'string' || Array.isArray(source)) {
    return normalizeRescriptsField(source)
  } else {
    const {rescripts, webpack, devServer, jest} = source
    !!(rescripts || webpack || devServer || jest) &&
      error('EMPTY CONFIG OBJECT')

    const normalized = {}

    if (rescripts) {
      normalized.rescripts = normalizeRescriptsField(rescripts)
    }

    if (webpack) {
      normalized.webpack = require(resolveRelativeOrNodeModule(webpack))
    }

    if (devServer) {
      normalized.devServer = require(resolveRelativeOrNodeModule(devServer))
    }

    if (jest) {
      normalized.jest = require(resolveRelativeOrNodeModule(jest))
    }

    return {
      ...source,
      rescripts,
      webpack,
      devServer,
      jest,
    }
  }
}

const rootRescript = pkgRescripts
  ? normalizeRescript(pkgRescripts)
  : require(existsInAppRoot('rescripts.js')
      ? join(appPath, 'rescripts')
      : '@rescripts/rescript-default')

module.exports = rootRescript
