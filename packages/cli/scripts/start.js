process.env.NODE_ENV = process.env.BABEL_ENV = 'development'

const gatherPipes = require('../loader')
const {
  webpack: webpackTransforms,
  devServer: devServerTransforms,
} = gatherPipes(['webpack', 'devServer'])

const {forEach} = require('ramda')
const patch = require('../patch')
const {paths} = require('@rescripts/utilities')
const {webpackConfig, webpackDevServerConfig, start} = paths

forEach(args => patch(...args), [
  [webpackTransforms, webpackConfig],
  [devServerTransforms, webpackDevServerConfig],
])

require(start)
