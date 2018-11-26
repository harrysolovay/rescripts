process.env.NODE_ENV = process.env.BABEL_ENV = 'production'

const patch = require('../patch')

const gatherPipes = require('../loader')
const {webpack} = gatherPipes(['webpack'])

const {paths} = require('@rescripts/utilities')
const {webpackConfigProd, build} = paths

patch(webpack, webpackConfigProd)

require(build)
