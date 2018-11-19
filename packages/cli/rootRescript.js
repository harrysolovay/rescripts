const {join, resolve} = require('path')
const {rescripts} = require(join(process.cwd(), 'package.json'))
const {sync} = require('glob')

const load = pathOrModuleName => {
  const [path] = sync(`${pathOrModuleName}*`)
  const absolute = path || require.resolve(pathOrModuleName)
  return require(absolute)
}

const normalizeRescriptFromPackage = rescripts => {
  if (Array.isArray(rescripts)) {
    return rescripts
  } else {
    const processes = ['webpack', 'devServer', 'jest']
    const normalized = {...rescripts}
    processes.forEach(p => {
      normalized[p] = load(rescripts[p])
    })
    return normalized
  }
}

// todo: enable scanning
module.exports = rescripts
  ? normalizeRescriptFromPackage(rescripts)
  : resolve('@rescripts/rescript-default')
