<h1 align='center'>
  <img src='readme-assets/banner.png' alt='banner' />
</h1>

<!-- LICENSE -->

<p align='center'>

<!-- LICENSE -->
<a href='https://github.com/rescripts/rescripts/blob/master/LICENSE'>
  <img src='https://img.shields.io/packagist/l/doctrine/orm.svg' />
</a>

<!-- PRs -->
<a href='http://makeapullrequest.com'>
  <img src='https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square' />
</a>

<!-- Lerna -->
<a href='https://lernajs.io/'>
  <img src='https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg' />
</a>

<!-- NPM -->
<a href='https://www.npmjs.com/package/@rescripts/cli'>
  <img src='https://img.shields.io/npm/v/@rescripts/cli.svg?style=flat-square' />
</a>

<!-- SemVer -->
<a href='https://semver.org/'>
  <img src='https://img.shields.io/badge/semver-0.0.4-blue.svg?maxAge=2592000'/>
</a>

</p>

<hr />

> Take control of your [create-react-app](https://github.com/facebook/create-react-app) project configurations. No ejecting, no custom react-scripts fork, no limitations.

## Highlights

- 🎯 create the perfect config with minimal effort

- 🎩 take advantage of cutting-edge software that hasn't made its way into CRA

- 🥳 draw from a library of open-source "rescripts"

- 👽 compatibility with "rewires" designed for react-app-rewired

## Guide

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Background](#background)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Rescript Structure](#rescript-structure)
- [Middleware](#middleware)
- [Rescript SDK](#rescript-sdk)
- [Rescript Library](#rescript-library)
- [Miscellaneous](#miscellaneous)
- [Acknowledgements](#acknowledgements)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Background

[CRA (create-react-app)](https://github.com/facebook/create-react-app) provides a first-class React developer experience. For building single-page web apps, it's not only the fastest boostrap––it's also the most carefully-curated, well-supported, and feature-fledged. There is a downside, however: in an effort to create stability and simplicity for beginners, its creators excluded many configuration options and newer technologies (such as Babel transformations based on early-stage [TC39](https://github.com/tc39) proposals). CRA comes with an "eject" script which––once irreversibly run––allows customization of the "start", "build", and "test" scripts, along with their corresponding configurations. While this does allow you some DX freedom, it isn't always preferable; ejection makes it impossible to upgrade to new versions of `react-scripts`, and it exposes a lot of tedious, knarly-lookin' code. Rescripts is for developers who don't want to eject or worry about configuration, but still want to use cutting-edge tools.

Tim Arney's [react-app-rewired](https://github.com/timarney/react-app-rewired) was the first project to successfully tackle this problem. It offered a solution that led to many "rewires" (community-made plugins for simpler setup). But––when CRA 2.0 came around––there were some breaking changes. Not to mention, the react-app-rewired DX was something to be further simplified.

Rescripts tackles this same probem for CRA 2.0+ with several key DX differences. First off, it was designed to be more of a focal point for all non-standard configuration. The underlaying loader can handle deeply nested "rescripts" (conceptually similar to babel plugins), all of which can modify any CRA process. The tools used to transform configuration are more robust and flexible than its predecessor's ([@rescripts/utilities](#rescript-sdk)), and should weather most updates. The API also exposes a middleware entry, so that you can track your configurations as they are transformed. It should also be noted that Rescripts is compatible with many Webpack rewires built for react-app-rewired.

If you like this framework, please tweet at [@gearon](https://twitter.com/dan_abramov) requesting an "everything-i-did-not-include" rescript!

## Installation

#### Install `@rescripts/cli` as a dev dependency:

```sh
npm i -D @rescripts/cli
```

#### Install the rescript(s) you wish to use:

```sh
npm i -D @rescripts/rescript-env
```

> @rescripts/rescript-env scans your `package.json` & project root for Babel, ESLint and TSLint configuration files. If present, these configurations will override the CRA defaults.

## Basic Usage

#### 1) Replace `react-scripts` calls with `rescripts` calls

`package.json`

```diff
{
  "name": "built-with-rescripts",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.6.1",
    "react-dom": "^16.6.1",
    "react-scripts": "2.1.1"
  }
  "devDependencies": {
    "@rescripts/cli": "^0.0.3",
    "@rescript/rescript-env"
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

#### 2) Define a 'rescripts' field and specify which to use

`package.json`

```diff
{
  "name": "built-with-rescripts",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.6.1",
    "react-dom": "^16.6.1",
    "react-scripts": "2.1.1"
  }
  "devDependencies": {
    "@rescripts/cli": "^0.1.0"
  }
  "scripts": {
    "start": "rescripts start",
    "build": "rescripts build",
    "test": "rescripts test"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
+ "rescripts": [
+   "env"
+ ]
}
```

You could also––instead of placing this in your `package.json`––specify your "root rescript" in a root-level `.rescriptsrc` file (with whatever convention you prefer: `.js`, `.json`, or no extension.)

#### 3) Use the newly-enabled feature(s)

In the case of [@rescripts/rescript-env](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/env), you will now be able to use custom Babel, ESLint and TSLint configurations. Use any of the following conventions:

**Babel:** place config inside of a root-level `.babelrc`, `.babelrc.js`, `.babelrc.json`, or `babel.config.js` file, or inside of the `babel` field of your `package.json`

**ESLint:** place config inside of a root-level`.eslintrc`, `.eslintrc.js`, `.eslintrc.json`, or `eslint.config.js` file, or inside of the `eslintConfig` field of your `package.json`

**TSLint:** place config inside of a root-level`tslint.js` or `tslint.json` file

#### 4) Good practice with the `env` rescript

`@rescripts/rescript-env` actually installs 3 rescripts:

- [`@rescripts/rescript-use-babel-config`](https://github.com/rescripts/rescripts/tree/master/packages/rescripts/use-babel-config)
- [`@rescripts/rescript-use-eslint-config`](https://github.com/rescripts/rescripts/tree/master/packages/rescripts/use-eslint-config)
- [`@rescripts/rescript-use-tslint-config`](https://github.com/rescripts/rescripts/tree/master/packages/rescripts/use-tslint-config)

For an incrementally faster boot time, use these independently and actually specify their configurations. Aka...

`.rescriptsrc`

```js
module.exports = [
  ['use-babel-config', '.babel.json'],
  ['use-tslint-config', 'tslint.json'],
]
```

## Advanced Usage

Your root rescript should be an array of other rescripts. Some rescripts take in options and/or other parameters. Some do not. Some contain functions that transform your webpack config. Some contain transformations for any combination of processes (`webpack`, `devServer` and `jest`). Consider the following:

In this example, the root rescript makes reference to [@rescripts/rescript-env](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/env). This rescript takes in no arguments, which means that it has to scan your project at every run.

```js
module.exports = ['env']
```

Alternatively, you could use [@rescripts/rescript-use-babel-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-babel-config) and [@rescripts/rescript-use-eslint-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-eslint-config) (or [@rescripts/rescript-use-tslint-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-tslint-config) if you prefer TypeScript):

```js
module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-eslint-config', '.eslintrc'],
]
```

This example illustrates how arguments can be passed to a rescript by wrapping its reference inside of another array and adding the arguments as subsequent elements.

The eventual goal of Rescripts is to provide a single, simple interface for deep customizations:

`.rescriptsrc.js`

```js
module.exports = [
  [
    'use-babel-config',
    {
      presets: ['react-app'],
      plugins: [
        'react-require',
        [
          'module-resolver',
          {
            root: '.',
            alias: {
              '~': './src',
            },
          },
        ],
      ],
    },
  ],
  [
    'use-eslint-config',
    {
      extends: ['react-app'],
      plugins: ['ramda'],
      rules: {
        'ramda/compose-pipe-style': 'error',
        'react/react-in-jsx-scope': 0,
      },
    },
  ],
]
```

## Rescript Structure

Rescripts transform the default configurations used by the three main processes of CRA (webpack, its developement server, and test-running via Jest). Rescripts can do much more though, such as writing logs, caching files, commiting changes and triggering other processes.

#### A rescript can be...

<details>
<summary>an array of other rescripts</summary>

`child-rescript.js`

```js
// define child rescript
module.exports = ['rescript-a', 'rescript-b', 'rescript-c']
```

`parent-rescript.js`

```js
// use child rescript
module.exports = [require.resolve('path/to/child-rescript')]
```

</details>

<details>
<summary>a function that takes in and returns a webpack config</summary>

`child-rescript.js`

```js
// define child rescript
module.exports = config => {
  const newConfig = doSomethingToTheConfig(config)
  return newConfig
},
```

`parent-rescript.js`

```js
// use child rescript
module.exports = [require.resolve('path/to/child-rescript')]
```

</details>

<details>
<summary>an object containing (any combination of) `webpack`, `devServer`, and `jest` functions, which take in and return their respective configs</summary>

`child-rescript.js`

```js
// define child rescript
module.exports = {
  webpack: config => {
    const newConfig = transformWebpackConfig(config)
    return newConfig
  },
  devServer: config => {
    const newConfig = transformDevServerConfig(config)
    return newConfig
  },
  jest: config => {
    const newConfig = transformJestConfig(config)
    return newConfig
  },
}
```

`parent-rescript.js`

```js
// use child rescript
module.exports = [require.resolve('path/to/child-rescript')]
```

</details>

<details>
<summary>a function that takes in arguments and outputs a new rescript</summary>

`child-rescript.js`

```js
// webpack only:
module.exports = options => config => {
  const newConfig = someTransformation(config, options)
  return newConfig
}

// or with multiple processes:
module.exports = (webpackArg, devServerArg, jestArg) => ({
  webpack: config => {
    const newConfig = transformWebpackConfig(config, webpackArg)
    return newConfig
  },
  devServer: config => {
    const newConfig = transformDevServerConfig(config, devServerArg)
    return newConfig
  },
  jest: config => {
    const newConfig = transformJestConfig(config, jestArg)
    return newConfig
  },
})
```

`parent-rescript.js`

```js
// use child rescript

// webpack only:
module.exports = [
  [require.resolve('path/to/child-rescript'), 'some important webpack arg'],
]

// multiple processes:
module.exports = [
  [
    require.resolve('path/to/child-rescript'),
    'webpackArg',
    'devServerArg',
    'jestArg',
  ],
]
```

</details>

<details>
<summary>a combination of formats</summary>

`child-rescript.js`

```js
// define child rescript
module.exports = [
  'some-rescripts',
  [
    'rescript-that-takes-args',
    {
      docsQuality: 'helpful?',
    },
  ],
  config => {
    const newConfig = doSomethingToTheConfig(config)
    return newConfig
  },
  [
    someArg => config => {
      const newConfig = doSomethingToTheConfig(config, someArg)
      return newConfig
    },
    'some argument',
  ],
]
```

`parent-rescript.js`

```js
// use child rescript
module.exports = [require.resolve('path/to/child-rescript')]
```

</details>

## Middleware

#### The term "middleware" in Rescripts describes a kind of rescript that runs between all other rescripts.

Let's say your stack of rescripts looks like this:

```js
const logConfig = config => {
  console.log(config)
  return config
}

logConfig.isMiddleware = true

module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-tslint-config', 'tslint.json'],
  logConfig,
]
```

The execution order will be as follows:

1. `logConfig`
2. `use-babel-config`
3. `logConfig`
4. `use-tslint-config`
5. `logConfig`

Don't be afraid to track data in the outer scope:

```js
let lastConfig = null

const logConfig = config => {
  console.log(config === lastConfig ? 'config unchanged' : 'config changed')

  lastConfig = config
  return config
}

logConfig.isMiddleware = true

module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-tslint-config', 'tslint.json'],
  logConfig,
]
```

<details>
<summary>In simplified form</summary>

```js
let lastConfig = null

logConfig.isMiddleware = true

module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-tslint-config', 'tslint.json'],
  Object.assign(
    config => {
      console.log(config === lastConfig ? 'config unchanged' : 'config changed')
      lastConfig = config
      return config
    },
    {isMiddleware: true},
  ),
]
```

</details>

We prefer to keep and mutate a `lastConfig` reference incase other middleware is applied before `logConfig`; middleware isn't spread around other middleware (this would be chaos), and yet middleware can transform what's passed to subsequent rescripts (including other middleware). This can get messy if you're not deliberate about your middleware's behavior.

## Rescript SDK

The `@rescripts/utilities` package makes it far easier to interact with configuration, while also reducing code size and the amount of conflict you'd otherwise see from composing numerous rescripts. You can use the tools in this package to identify and transform parts of any configuration without an exact path.

```sh
npm i -D @rescripts/utilities
```

> @rescripts/utilities comes with @rescripts/cli (so there's no need to install if you're already working on a rescripted project)

### Reference

> **For FP-lovers: all of `@rescripts/utilities`' methods are curried, so feel free to call them in stages. Use Ramda's [`R.__`](https://ramdajs.com/docs/#__) placeholder to reorder how arguments are pieced together in the resulting functions.**

#### `getPaths(predicate, scanTarget)`

Recursively traverses your config (or any object for that matter) and returns an array of paths to any nodes that match the predicate. This is useful for editing parts of a config that may change location at runtime (ostensibly because of another rescript in the transformation pipeline).

<details>
<summary>usage example</summary>

```js
const {getPaths} = require('@rescripts/utilities')

const isBabelLoader = inQuestion =>
  inQuestion && inQuestion.loader && inQuestion.loader.includes('babel-loader')

module.exports = config => {
  const babelLoaderPaths = getPaths(isBabelLoader, config)
  console.log(babelLoaderPaths) // [['module', 'rules', 2, 'oneOf', 1]]
  return config
}
```

</details>

#### `edit(transform, paths, config)`

Takes in a transformation function and the paths at which that function should be applied, along with the object on which to apply it.

<details>
<summary>usage example</summary>

```js
const {getPaths, edit} = require('@rescripts/utilities')

module.exports = config => {
  const paths = getPaths(somePredicate, config)
  return edit(
    matchedSection => {
      // change something about the subsection
      const updatedSection = someTransformation(matchedSection)
      return updatedSection
    },
    paths,
    config,
  )
}
```

</details>

#### `replace(replacement, paths, config)`

Works the same as `edit`, only it takes in a replacement for the specified path rather than a transformation function.

<details>
<summary>usage example</summary>

```js
const {getPaths, replace} = require('@rescripts/utilities')

module.exports = config => {
  const paths = getPaths(somePredicate, config)
  return replace('some replacement', paths, config)
}
```

</details>

#### `remove(paths, config)`

Takes in the specified path and the object for the path-specified deletion.

<details>
<summary>usage example</summary>

```js
const {getPaths, remove} = require('@rescripts/utilities')

module.exports = config => {
  const paths = getPaths(somePredicate, config)
  return remove(paths, config)
}
```

</details>

#### `getWebpackPlugin(constructorName, config)`

Retrieve a plugin instance from the webpack config with the plugin's constructor name.

<details>
<summary>usage example</summary>

```js
const {getWebpackPlugin} = require('@rescripts/utilities')

module.exports = config => {
  getWebpackPlugin('ForkTsCheckerWebpackPlugin', config) &&
    console.log('TypeScript enabled')
  return config
}
```

</details>

#### `prependWebpackPlugin(pluginInstance, config)`

Add a plugin instance to the first slot of the Webpack configuration's `plugins` array.

<details>
<summary>usage example</summary>

```js
const {prependWebpackPlugin} = require('@rescripts/utilities')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')

module.exports = config => {
  return prependWebpackPlugin(
    new WebpackBuildNotifierPlugin({
      title: 'Rescripted App',
      logo: require.resolve('./public/icon.png'),
      suppressSuccess: true,
    }),
    config,
  )
}

// or simplified...

module.exports = prependWebpackPlugin(
  new WebpackBuildNotifierPlugin({
    title: 'Rescripted App',
    logo: require.resolve('./public/icon.png'),
    suppressSuccess: true,
  }),
)
```

</details>

#### `appendWebpackPlugin(pluginInstance, config)`

Add a plugin instance to the last slot of the Webpack configuration's `plugins` array.

<details>
<summary>usage example</summary>

```js
const {appendWebpackPlugin} = require('@rescripts/utilities')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')

module.exports = config => {
  return appendWebpackPlugin(
    new WebpackBuildNotifierPlugin({
      title: 'Rescripted App',
      logo: require.resolve('./public/icon.png'),
      suppressSuccess: true,
    }),
    config,
  )
}

// or simplified...

module.exports = appendWebpackPlugin(
  new WebpackBuildNotifierPlugin({
    title: 'Rescripted App',
    logo: require.resolve('./public/icon.png'),
    suppressSuccess: true,
  }),
)
```

</details>

#### `editWebpackPlugin(transform, constructorName, config)`

Applies the `transform` function to the Webpack plugin whose constructor name is a match.

<details>
<summary>usage example</summary>

```js
const {editWebpackPlugin} = require('@rescripts/utilities')

module.exports = config => {
  const edited = editWebpackPlugin(
    p => {
      p.someOption = 'changed'
      return p
    },
    'DefinePlugin',
    config,
  )
  return edited
}

// or simplified...

module.exports = editWebpackPlugin(
  p => {
    p.someOption = 'changed some option'
    return p
  },
  'DefinePlugin',
  config,
)
```

</details>

#### `replaceWebpackPlugin(replacement, constructorName, config)`

Replaces the matched plugin with another.

<details>
<summary>usage example</summary>

```js
const {replaceWebpackPlugin} = require('@rescripts/utilities')
const WebpackPWAManifestPlugin = require('webpack-pwa-manifest')

module.exports = config => {
  const replaced = replaceWebpackPlugin(
    new WebpackPWAManifestPlugin({
      name: 'Rescripted App',
      short_name: 'Example',
      description: 'An example app that uses Rescripts',
      background_color: '#fff',
      crossorigin: 'use-credentials',
      icons: [
        {
          src: require.resolve('./public/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),
    'ManifestPlugin',
    config,
  )
  return replaced
}
```

</details>

#### `removeWebpackPlugin(constructorName, config)`

Remove the matched plugin from your config.

<details>
<summary>usage example</summary>

```js
const {removeWebpackPlugin} = require('@rescripts/utilities')

module.exports = config => {
  const withoutIgnorePlugin = removeWebpackPlugin('IgnorePlugin', config)
  return withoutIgnorePlugin
}

// or simplified ...

const {removeWebpackPlugin} = require('@rescripts/utilities')

module.exports = removeWebpackPlugin('IgnorePlugin', config)
```

</details>

## Rescript Library

- [env](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/env) – use Babel, ESLint, and/or TSLint
- [use-babel-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-babel-config) – specify a Babel configuration
- [use-eslint-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-eslint-config) – specify an ESLint configuration
- [use-tslint-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-tslint-config) – specify a TSLint configuration
- [use-rewire](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-rewire) – use a rewire designed for react-app-rewired
- [use-stylelint-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-stylelint-config) – specify a StyleLint config (works for CSS, SCSS & CSS-in-JS)
- **MORE COMING SOON!**

## Miscellaneous

Thank you for checking out (and maybe even building software with) Rescripts. If you have any bug reports or feature ideas, please go ahead and file an issue. If you have any other questions, comments, etc., please reach out to harrysolovay@gmail.com.

## Acknowledgements

Big shout out to...

- [Nilan Marktanner](https://github.com/marktani), an inspirational dude
- [Daniel Shaffer](https://github.com/danielshaffer), learning Vue instead of React 🤬
- [Weiliy](https://github.com/weiliy), the original owner of the NPM name 'rescripts'

This library has been released under the [MIT license](../blob/master/LICENSE)

**SO DO WHATEVER THE \$%#@ YOU WANT WITH IT!!!**
