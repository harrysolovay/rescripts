const {sync} = require('glob')
const {isLiteral, compose} = require('@rescripts/utilities')

const isConfig = config =>
  typeof config === 'function' ||
  (isLiteral(config) &&
    !!!(
      !config.rescripts &&
      !config.webpack &&
      !config.devServer &&
      !config.jest
    ))

const load = pathOrModuleName => {
  const [path] = sync(pathOrModuleName)
  const absolute = path || require.resolve(pathOrModuleName)
  return require(absolute)
}

module.exports = (rootRescript, which) => {
  const pipes = which.map(() => [])
  const indices = Object.assign(
    {},
    ...which.map(p => ({[p]: which.indexOf(p)})),
  )

  const applyRescripts = rescript => {
    const rescripts = Array.isArray(rescript)
      ? rescript
      : rescript.rescripts || false

    rescripts &&
      rescripts.forEach(rescript => {
        if (Array.isArray(rescript)) {
          // fix resolution
          applyRescripts(load(rescript[0])(rescript[1]))
        } else {
          const r = isConfig(rescript) ? rescript : load(rescript)
          console.log('it is not', r)
          applyRescripts(r)
        }
      })

    if (!Array.isArray(rescript)) {
      if (which.includes('webpack')) {
        const webpack =
          typeof rescript === 'function'
            ? rescript
            : rescript.webpack
            ? rescript.webpack
            : false
        webpack && pipes[indices.webpack].push(webpack)
      }

      if (which.includes('devServer')) {
        const {devServer} = rescript
        devServer && pipes[indices.devServer].push(devServer)
      }

      if (which.includes('jest')) {
        const {jest} = rescript
        jest && pipes[indices.jest].push(jest)
      }
    }
  }

  applyRescripts(rootRescript)
  return pipes.map(fns => compose(...fns))
}
