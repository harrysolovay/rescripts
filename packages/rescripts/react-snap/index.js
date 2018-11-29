const {paths} = require('@rescripts/utilities')
const {package} = paths
const {assoc, mergeDeepWith, mergeRight} = require('ramda')

module.exports = options => config => {
  if (process.env.NODE_ENV === 'production') {
    console.log(options)
    const loaded = require(package)

    const withReactSnapConfig = assoc(
      'reactSnap',
      {
        source: 'build',
        minifyHtml: {
          collapseWhitespace: false,
          removeComments: false,
        },
        inlineCss: true,
      },
      loaded,
    )

    const toBeMerged = {
      scripts: {
        'generate-sw':
          'sw-precache --root=build --config scripts/sw-precache-config.js && uglifyjs build/service-worker.js -o build/service-worker.js',
        'build-snap':
          'react-scripts build && react-snap && yarn run generate-sw',
        postbuild: 'react-snap',
      },
    }

    const withScripts = mergeDeepWith(
      mergeRight,
      withReactSnapConfig,
      toBeMerged,
    )

    const stringified = JSON.stringify(withScripts)

    // finish this!
  }

  return config
}
