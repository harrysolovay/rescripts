const {resolveRelativeOrNodeModule, compose} = require('@rescripts/utilities')

const normalizeRescriptEntry = rescript =>
  typeof rescript === 'string'
    ? require(resolveRelativeOrNodeModule(rescript))
    : rescript

module.exports = (rootRescript, which) => {
  const indices = Object.assign(
    {},
    ...which.map(p => ({[p]: which.indexOf(p)})),
  )
  const pipes = which.map(() => [])

  const applyRescripts = rescript => {
    const rescripts = Array.isArray(rescript)
      ? rescript.map(normalizeRescriptEntry)
      : typeof rescript === 'string'
      ? [normalizeRescriptEntry(rescript)]
      : rescript.rescripts
      ? Array.isArray(rescript.rescripts)
        ? rescript.rescripts
        : [rescript.rescripts]
      : false

    rescripts &&
      rescripts.forEach(rescript => {
        applyRescripts(rescript)
      })

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

  applyRescripts(rootRescript)
  return pipes.map(fns => compose(...fns))
}
