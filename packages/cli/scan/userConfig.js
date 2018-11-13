const {rootPath, existsInRoot} = require('../utilities')

const applyRescript = (config, script) => {
  let newConfig = {...config}
  const modulePath = existsInRoot(script) ? `${rootPath}/${script}` : script
  const rescript = require(modulePath)
  newConfig = rescript(newConfig)
  return newConfig
}

module.exports = config => {
  const pkg = require(`${rootPath}/package.json`)
  const {rescripts} = pkg
  let newConfig = {...config}
  if (!rescripts) return newConfig

  if (typeof rescripts === 'string') {
    newConfig = applyRescript(newConfig, rescripts)
  }

  if (Array.isArray(rescripts)) {
    rescripts.forEach(script => {
      newConfig = applyRescript(newConfig, script)
    })
  }

  return reconfig
}
