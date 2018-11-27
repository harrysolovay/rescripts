process.env.NODE_ENV = process.env.BABEL_ENV = 'test'

const {paths} = require('@rescripts/utilities')
const {createJestConfig, test} = paths

const gatherPipes = require('../loader')
const {jest: transforms} = gatherPipes(['jest'])

const patch = require('../patch')
patch(transforms, createJestConfig)

require(test)
