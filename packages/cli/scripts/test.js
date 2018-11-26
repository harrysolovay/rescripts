process.env.NODE_ENV = process.env.BABEL_ENV = 'test'

const patch = require('../patch')

const gatherPipes = require('../loader')
const {jest: transformJest} = gatherPipes(['jest'])

const {paths} = require('@rescripts/utilities')
const {createJestConfig, loadFromReactScriptsNodeModules, root, test} = paths

const getConfig = require(createJestConfig)
const config = () => getConfig(loadFromReactScriptsNodeModules, root, false)

patch(transformJest, config)

require(test)
