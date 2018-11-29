<h1 align='center'>
  <img src='readme-assets/banner.png' alt='banner' />
</h1>

<!-- LICENSE -->

<p align='center'>

<!--<a href='https://github.com/rescripts/rescripts/blob/master/LICENSE'>
  <img src='https://img.shields.io/npm/l/rescripts.svg?style=flat-square' />
</a>-->

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
  <img src='https://img.shields.io/badge/semver-0.0.3-blue.svg?maxAge=2592000'/>
</a>

</p>

<hr />

> Advance your [create-react-app](https://github.com/facebook/create-react-app) project configurations. No ejecting, no custom react-scripts fork, no more limitations.

## Highlights

- 🎯 create the perfect configuration with minimal effort
- 🎩 take advantage of cutting-edge software that hasn't made its way into CRA
- 🥳 library of open-source "rescripts"

## Guide

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Background

[CRA (create-react-app)](https://github.com/facebook/create-react-app) provides a first-class React developer experience. For building single-page web apps, it's not only the fastest boostrap––it's also the most carefully-curated, well-supported, and feature-fledged. There is a downside, however: in an effort to create stability and simplicity for beginners, it excludes many configuration options and newer technologies (such as Babel transformations based on early-stage [TC39](https://github.com/tc39) proposals). CRA comes with an "eject" script which––once irreversibly run––allows customization of the "start", "build", and "test" scripts, along with their corresponding configurations. While this does allow you some DX freedom, it isn't always preferable; ejection makes it impossible to upgrade to new versions of `react-scripts`, and it exposes a lot of tedious, knarly-lookin' code. Rescripts is for developers who don't want to eject or worry about configuration, but still want to use cutting-edge tools.

Tim Arney's [react-app-rewired](https://github.com/timarney/react-app-rewired) was the first project to successfully tackle this problem. On top of offering a solution, it led to many "rewires" (community-made plugins for simpler setup). But––when CRA 2.0 came around––there were some breaking changes. Not to mention, the react-app-rewired's DX was something to be further simplified.

Rescripts tackles this same probem for CRA 2.0+ with several key DX differences. It was designed to be the focal point for all non-standard configuration. The underlaying loader can handle deeply nested "rescripts" (conceptually similar to babel plugins), all of which can modify any CRA process. The API also exposes a middleware entrance, so that you can track the configuration as it gets transformed. It should be noted that Rescripts is compatible with Webpack rewires built for react-app-rewired.

If you like this framework, please tweet at [@gearon](https://twitter.com/dan_abramov) requesting a `everything-i-did-not-include` rescript 🤩

## Installation

#### Install `@rescripts/cli` as a dev dependency:

```sh
yarn add -D @rescripts/cli
```

#### Install the rescript(s) you wish to use:

```sh
yarn add -D @rescripts/rescript-env
```

#### Mix and match for your prefered setup:

- [env](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/env) – use Babel, ESLint, and/or TSLint
- [use-babel-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-babel-config) – specify a Babel configuration
- [use-eslint-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-eslint-config) – specify an ESLint configuration
- [use-tslint-config](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-tslint-config) – specify a TSLint configuration
- [use-rewire](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-rewire) – use a rewire designed for react-app-rewired
- [use-webpack-plugin](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/use-webpack-plugin) – add a webpack plugin(s)

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
+ "devDependencies": {
+   "@rescripts/cli": "^0.1.0"
+ }
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

#### 2) Define a rescripts field and specify which to use

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
  "rescripts": [
    ["env", {
      "babel": ".babelrc.js",
      "eslint": "package.json"
    }]
  ]
}
```

#### 3) Use the newly-enabled feature(s)

In the case of [@rescripts/rescript-env](https://github.com/rescripts/rescripts/blob/master/packages/rescripts/env), you will now be able to use a `.babelrc.js` to configure [Babel](https://babeljs.io/), and the "eslintConfig" field in `package.json` to configure [ESLint](https://eslint.org/).

By default, there are two ways to specify your "root rescript". Either define a "rescripts" field in your `package.json` (as is done above), or create a `.rescriptsrc` file in your project root (use whatever convention you prefer: `.js`, `.json`, or no extension.)

## Advanced Configuration

Your root rescript should be an array of other rescripts. Some rescripts take in options and/or other parameters. Some do not. Some contain functions that transform your webpack config. Some contain transformations for any combination of processes (`webpack`, `devServer` and `jest`). Consider the following:

In this example, the root rescript contains [@rescripts/rescript-use-babel-config]() with no configuration (it will scan the `package.json` and project root for the Babel config):

```json
["use-babel-config"]
```

You could also specify the rescript by its full NPM name:

```json
["@rescripts/rescript-use-babel-config"]
```

To pass in arguments, wrap the rescript inside of another array and add the arguments as subsequent elements. In the following example, we specify where to look for the babel configuration (so that there's no need to waste resources scanning for the config):

```json
[["use-babel-config", ".babelrc"]]
```

We could also pass the configuration into the rescript directly:

```json
[
  [
    "use-babel-config",
    {
      "presets": ["react-app"],
      "plugins": [
        [
          "module-resolver",
          {
            "root": ".",
            "alias": {
              "~": "./src"
            }
          }
        ]
      ]
    }
  ]
]
```

## Rescript Structure

Rescripts transform and return the updated configurations used by the three main processes of CRA (Webpack, Developement Server, Jest). They can also trigger other changes to the project, such as writing logs, caching files, and triggering other node processes.

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
<summary>a function that takes in and returns the webpack config</summary>

`child-rescript.js`

```js
// define child rescript
const transformWebpackConfig = () => {...}

module.exports = config => {
  const newConfig = transformWebpackConfig(config)
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
<summary>an object containing (any combination of) `webpack`, `devServer`, and `jest` functions, which take in and returns their respective configs</summary>

`child-rescript.js`

```js
// define child rescript
const transformWebpackConfig = () => {...}
const transformDevServerConfig = () => {...}
const transformJestConfig = () => {...}

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
// define child rescript
const transformWebpackConfig = () => {...}
const transformDevServerConfig = () => {...}
const transformJestConfig = () => {...}

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

## Miscellaneous

Thank you for checking out (and maybe even building software with) Rescripts. If you have any bug reports or feature ideas, please go ahead and file an issue. If you have any other questions, comments, etc., please reach out to harrysolovay@gmail.com.

## Acknowledgements

Big shout out to...

- [Nilan Marktanner](https://github.com/marktani), an inspirational dude
- [Daniel Shaffer](https://github.com/danielshaffer), learning Vue instead of React 🤬
- [Weiliy](https://github.com/weiliy), the original owner of the NPM name 'rescripts'

This library has been released under the [MIT license](../blob/master/LICENSE)

**SO DO WHATEVER THE \$%#@ YOU WANT WITH IT!!!**
