process.env.NODE_ENV = process.env.BABEL_ENV = 'development'

const {forEach} = require('ramda')
const patch = require('../patch')

const gatherPipes = require('../loader')
const {webpack, devServer} = gatherPipes(['webpack', 'devServer'])

const {paths} = require('@rescripts/utilities')
const {webpackConfigDev, webpackDevServerConfig, start} = paths

forEach(args => patch(...args), [
  [webpack, webpackConfigDev],
  [devServer, webpackDevServerConfig],
])

require(start)
