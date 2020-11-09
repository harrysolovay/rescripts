const error = message => {
  console.error(message)
}

const exitWithError = message => {
  error(message)
  process.exit(1)
}

module.exports = {
  error,
  exitWithError,
}
