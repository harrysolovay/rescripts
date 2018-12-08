process.env.NODE_ENV = process.env.BABEL_ENV = 'test'

const gatherPipes = require('../loader')
const {jest: transforms} = gatherPipes(['jest'])

const patch = require('../patch')
const {paths} = require('@rescripts/utilities')
const {createJestConfig, test} = paths

patch(transforms, createJestConfig)

require(test)
