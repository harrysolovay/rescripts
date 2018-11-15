const {compose} = require('@rescripts/utilities')

module.exports = (rootPreset, which) => {
  const indices = Object.assign(
    {},
    ...which.map(p => ({[p]: which.indexOf(p)})),
  )
  const pipes = which.map(() => [])

  const applyPreset = preset => {
    const presets = Array.isArray(preset)
      ? preset
      : preset.presets
      ? preset.presets
      : false

    presets &&
      presets.forEach(preset => {
        applyPreset(preset)
      })

    if (which.includes('webpack')) {
      const webpack =
        typeof preset === 'function'
          ? preset
          : preset.webpack
          ? preset.webpack
          : false
      webpack && pipes[indices.webpack].push(webpack)
    }

    if (which.includes('devServer')) {
      const {devServer} = preset
      devServer && pipes[indices.devServer].push(devServer)
    }

    if (which.includes('jest')) {
      const {jest} = preset
      jest && pipes[indices.jest].push(jest)
    }
  }

  applyPreset(rootPreset)
  return pipes.map(fns => compose(...fns))
}
