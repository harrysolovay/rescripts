module.exports = {
  rescripts: [
    require('@rescripts/rescript-use-babel-config'),
    require('@rescripts/rescript-use-eslint-config'),
  ],

  devServer: configFn => (proxy, allowedHost) => {
    const config = configFn(proxy, allowedHost)
    config.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, Content-Type, Authorization',
    }
    return config
  },
}
