module.exports = {
  // a directory should be the same as "reactSnap.destination",
  // which default value is `build`
  staticFileGlobs: [
    'build/static/css/*.css',
    'build/static/js/*.js',
    'build/shell.html',
    'build/index.html',
  ],
  stripPrefix: 'build',
  publicPath: '.',
  // there is "reactSnap.include": ["/shell.html"] in package.json
  navigateFallback: '/shell.html',
  // Ignores URLs starting from /__ (useful for Firebase):
  // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
  navigateFallbackWhitelist: [/^(?!\/__).*/],
  // By default, a cache-busting query parameter is appended to requests
  // used to populate the caches, to ensure the responses are fresh.
  // If a URL is already hashed by Webpack, then there is no concern
  // about it being stale, and the cache-busting can be skipped.
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  // configuration specific to this experiment
  runtimeCaching: [
    {
      urlPattern: /api/,
      handler: 'fastest',
    },
  ],
}
