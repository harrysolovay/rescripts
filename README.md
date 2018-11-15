<h1 align='center'>
  <img src='readme-assets/banner.png' alt='banner' />
</h1>

<!-- LICENSE -->

<p align='center'>

<a href='https://github.com/harrysolovay/rescripts/blob/master/LICENSE'>
  <img src='https://img.shields.io/npm/l/rescripts.svg?style=flat-square' />
</a>

<!-- NPM -->
<a href='https://www.npmjs.com/package/rescripts'>
  <img src='https://img.shields.io/npm/v/rescripts.svg?style=flat-square' />
</a>

<!-- PRs -->
<a href='http://makeapullrequest.com'>
  <img src='https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square' />
</a>

<!-- Lerna -->
<a href='https://lernajs.io/'>
  <img src='https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg' />
</a>

</p>

<hr />

> Advance your [CRA (create-react-app)](https://github.com/facebook/create-react-app) project configurations. No ejecting, no custom react-scripts fork, no more limitations.

## Highlights

- 🎯 create the perfect configuration with minimal effort

- 🎩 take advantage of cutting-edge software that hasn't made its way into CRA

- 🥳 pick and choose from a vast collection of "rescripts" (presets/plugins)

## Background

[CRA (create-react-app)](https://github.com/facebook/create-react-app) provides a first-class React developer experience. For building single-page webapps, it's not only the fastest boostrap––it's also the most carefully-curated, well-supported, and feature-fledged. There is a downside, however. In an effort to create stability and simplicity for beginners, it excludes many configuration options and newer technologies (such as Babel transformations based on early-stage [TC39](https://github.com/tc39) proposals). CRA comes with an "eject" script, which is an escape hatch for customizing how other scripts ("start", "build", "test") operate. While this does allow you to create advanced configurations, it isn't preferable; ejection makes it impossible to upgrade to new versions of `react-scripts`, and it exposes the guts of process configurations (knarly-lookin'). Rescripts is for developers who don't want to eject or worry about configuration, but still want to use cutting-edge developer tooling.

Tim Arney's [react-app-rewired](https://github.com/timarney/react-app-rewired) was––in my humble opinion––the first piece of open source to successfully and reliably solve this problem (pre-CRA 2.0). On top of offering a solution, it led to many "rewires" (community-made plugins for simpler setup).

Rescripts tackles this same probem for CRA 2.0+ in a way that is compatible with rewires built for react-app-rewired. It also introduces a default "rescript" (similar to a rewire) which automatically scans your project for the existence of ESLint and Babel configuration files. Rescripts are loaded in a modular style, with a DX similar to that of Babel preset loading.

## Installation

```sh
npm i -D rescripts
```

## Basic Usage

#### 1) Replace `react-scripts` calls with `rescripts` calls

```diff
{
  "name": "built-with-rescripts",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.6.1",
    "react-dom": "^16.6.1",
    "react-scripts": "2.1.1"
  },
  "devDependencies": {
+   "rescripts": "^0.1.0"
  }
  "scripts": {
-   "start": "react-scripts start",
+   "start": "rescripts start",
-   "build": "react-scripts build",
+   "build": "rescripts build",
-   "test": "react-scripts test",
+   "test": "rescripts test",
-   "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
```

#### 2) Add custom Babel & ESLint configs

Add custom configurations for Babel and/or/nor ESLint at your project's root director. For file name, use whatever convention you prefer:

**Babel:** `.babelrc`, `.babelrc.js`, or `babel.config.js`

**ESLint:** `.eslint`, `.eslintrc.js`, or `eslint.config.js`

Or specify the configuration in your package.json:

```diff
{
  "name": "built-with-rescripts",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.6.1",
    "react-dom": "^16.6.1",
    "react-scripts": "2.1.1"
  },
  "devDependencies": {
    "rescripts": "^0.1.0"
  }
  "scripts": {
    "start": "rescripts start",
    "build": "rescripts build",
    "test": "rescripts test"
  },
- "eslintConfig": {
-   "extends": "react-app",
-   "rules": {
-     "some-rule": [1, "always"]
-   }
- },
- "babel": {
-   "presets": [
-     "react-app"
-   ],
-   "plugins": [
-     "some-babel-plugin"
-   ]
- }
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
```

Note: when specifying the destination of a config/preset from your package.json, you cannot specify an rc file (only accepts js or json formats).

## Advanced Config

### Processes

Rescripts exposes three main configurable processes of CRA:

1. **Webpack** is responsible for both development and production builds. This is likely where the bulk of your rescripting will go.
2. **Development server**––you'll want to configure `devServer` if you need to make use of proxying or are working with APIs that request assets of your site in development.
3. **Jest** is for testing your application. Be weary... it can be volatile. If you look at [the testing script](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/test.js) in `react-scripts`, you'll find comments about plans for a more stable replacement. Until then, Jest usage might require some keyboard blood & tears. Please file issues!

### Configuration

#### Point to your rescript(s)

Point to a "rescript" (configuration file) from your `package.json`:

```diff
{
  "name": "built-with-rescripts",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.6.1",
    "react-dom": "^16.6.1",
    "react-scripts": "2.1.1"
  },
  "devDependencies": {
    "rescripts": "^0.1.0"
  }
  "scripts": {
    "start": "rescripts start",
    "build": "rescripts build",
    "test": "rescripts test"
  },
+ "rescripts": "./path/to/rescript",
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
```

... or point to a rescript in node_modules:

```diff
"rescripts": "@rescripts/preset-lighthouse",
```

... or point to multiple rescripts:

```diff
"rescripts": [
  "@rescripts/preset-default",
  "@rescripts/preset-lighthouse"
],
```

### Config File

#### Example

```js
module.exports = {
  presets: [require('@rescripts/preset-default')],
  webpack: config => {
    // [do something to the config]
    return config
  },
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
```

#### Webpack-only

If your reconfiguration targets Webpack only, your rescript can directly export the Webpack function:

```js
module.exports = () => {
  // [do something to the config]
  return config
}
```

#### Development vs. Production

To differentiate between development and production reconfiguration, go ahead and reference environment variables as necessary.

```js
module.exports => {
  "presets": [
    process.env.NODE_ENV === 'production' &&
      require('@rescripts/preset-image-compression')
  ]
}
```

## Rescripts

- [rescript-default](https://github.com),
- [rescript-lighthouse](https://github.com),
- [rescript-image-compression](https://github.com),

## Miscellaneous

Thank you for checking out (maybe even building software with) Rescripts. If you have any bug reports or feature ideas, please go ahead and file an issue. If you have any other questions, comments, etc., please reach out to harrysolovay@gmail.com.

## Acknowledgements

Big shout out to...

- [Nilan Marktanner](https://github.com/marktani), an inspirational human being
- [Daniel Shaffer](https://github.com/danielshaffer), learning Vue instead of React ;)
- [Weiliy](https://github.com/weiliy), the original owner of the NPM name

This library has been released under the [MIT license](../blob/master/LICENSE)

**SO DO WHATEVER THE \$%#@ YOU WANT WITH IT!!!**
