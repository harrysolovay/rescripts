const {compose} = require('@rescripts/utilities')

module.exports = (rootRescript, ...which) => {
  const indices = Object.assign(
    {},
    ...which.map(p => ({[p]: which.indexOf(p)})),
  )
  const pipes = which.map(() => [])

  const applyRescripts = rescript => {
    const rescripts = Array.isArray(rescript)
      ? rescript
      : rescript.rescripts
      ? rescript.rescripts
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
