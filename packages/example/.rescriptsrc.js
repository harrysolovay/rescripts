module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-eslint-config', '.eslintrc'],
  [
    options => ({
      webpack: config => {
        console.log(options)
        return config
      },
      devServer: configFn => {
        console.log('yolo')
        return configFn
      },
    }),
    'hello',
  ],
  {
    webpack: config => {
      console.log('yaya')
      return config
    },
  },
  [
    options => config => {
      console.log(options)
      return config
    },
    'bam',
  ],
  config => {
    console.log('YAYAYAYAYAY')
    return config
  },
]
