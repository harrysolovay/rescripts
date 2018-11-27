const {evolve, append, flatten} = require('ramda')

const addWebpackPlugin = (plugins, config) =>
  evolve(
    {
      plugins: x => {
        const appended = append(plugins, x)
        return flatten(appended)
      },
    },
    config,
  )

module.exports = {
  addWebpackPlugin,
}
