const paths = require('./paths')
const {existsSync, mkdirSync, writeFileSync} = require('fs')
const {join} = require('path')

const createLogs = (destination, toLog) => {
  !existsSync(destination) && mkdirSync(destination)
  toLog.forEach(({fileName, contents}) => {
    writeFileSync(
      join(destination, fileName),
      `module.exports = ${contents}`,
      'utf-8',
    )
  })
}

const compose = (...fns) => arg =>
  fns.reduce((accumulator, fn) => fn(accumulator), arg)

const error = (messageOrFn, ...args) => {
  const message =
    typeof messageOrFn === 'function'
      ? messageOrFn(args)
      : typeof messageOrFn === 'string'
      ? messageOrFn
      : 'invalid argument passed to error'
  console.error(message)
  process.exit(1)
}

const isLiteral = inQuestion => {
  if (typeof inQuestion !== 'object' || inQuestion === null) return false
  let test = inQuestion
  while (!false) {
    if (Object.getPrototypeOf((test = Object.getPrototypeOf(test))) === null)
      break
  }
  return Object.getPrototypeOf(inQuestion) === test
}

module.exports = {
  ...paths,
  createLogs,
  compose,
  error,
  isLiteral,
}
