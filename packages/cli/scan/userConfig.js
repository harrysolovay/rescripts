const fs = require('fs')
const path = require('path')
const {rootPath, existsInRoot} = require('../utilities')

const applyRescripts = (config, rescriptsPath) => {
  let newConfig = {...config}

  const substring = rescriptsPath.substring(0, 2)
  const isModule = !(substring.includes('.') || substring.includes('/'))
  const absoluteRescriptsPath = isModule
    ? `${rootPath}/node_modules/${rescriptsPath}`
    : path.join(rootPath, rescriptsPath)
  const rescripts = require(absoluteRescriptsPath)

  rescripts.presets.forEach(preset => {
    newConfig = applyRescripts(newConfig, preset)
  })

  newConfig = rescript.webpack(newConfig)
  return newConfig
}

module.exports = config => {
  const pkg = require(`${rootPath}/package.json`)
  const {rescripts} = pkg

  if (!rescripts) return config

  let newConfig = {...config}

  if (typeof rescripts === 'string') {
    newConfig = applyRescripts(newConfig, rescripts)
  }

  if (Array.isArray(rescripts)) {
    rescripts.forEach(script => {
      newConfig = applyRescripts(newConfig, script)
    })
  }

  return newConfig
}
