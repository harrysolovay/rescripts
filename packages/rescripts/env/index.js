const {loadFromPackageField, resolveFromRoot} = require('@rescripts/utilities')
const useBabelConfig = require('@rescripts/rescript-use-babel-config')
const useESLintConfig = require('@rescripts/rescript-use-eslint-config')
const useTSLintConfig = require('@rescripts/rescript-use-tslint-config')
const {split, last, reduce, compose} = require('ramda')

const nameOnly = path => (path ? last(split('/', path)) : null)

module.exports = config => {
  const babelConfig =
    loadFromPackageField('babel') ||
    nameOnly(resolveFromRoot('.babelrc') || resolveFromRoot('config.babel'))

  const eslintConfig =
    loadFromPackageField('eslintConfig') ||
    nameOnly(resolveFromRoot('.eslintrc') || resolveFromRoot('config.eslint'))

  const tslintConfig =
    resolveFromRoot('tsconfig.json') && resolveFromRoot('tslint')

  const transforms = reduce(
    (accumulator, [rescript, path]) =>
      path ? [...accumulator, rescript(path)] : accumulator,
    [],
    [
      [useBabelConfig, babelConfig],
      [useESLintConfig, eslintConfig],
      [useTSLintConfig, tslintConfig],
    ],
  )

  const transform = compose(...transforms)
  return transform(config)
}

//
