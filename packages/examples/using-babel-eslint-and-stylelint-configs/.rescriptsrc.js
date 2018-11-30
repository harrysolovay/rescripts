module.exports = [
  ['use-babel-config', '.babelrc.js'],
  ['use-eslint-config', '.eslintrc.js'],
  [
    'use-stylelint-config',
    {
      formats: ['css', 'js'],
      path: '.stylelintrc',
    },
  ],
]
