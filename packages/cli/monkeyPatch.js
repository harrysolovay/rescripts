module.exports = (configPath, rescript) => {
  const config = require(configPath)
  const rescriptedConfig = rescript(config)
  require.cache[require.resolve(configPath)].exports = rescriptedConfig
  return rescriptedConfig
}
