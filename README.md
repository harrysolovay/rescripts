<div align="center">
<h1>Rescripts [IN PROGRESS]</h1>
</div>

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

</p>

<hr />

> Advance your [CRA (create-react-app)](https://github.com/facebook/create-react-app) project configurations. No ejecting, no custom react-scripts fork, no more limitations.

## Highlights

- 🐣 get your environment up & running faster than ever before

- 🎯 create the perfect configuration with minimal effort

- 🎩 take advantage of cutting-edge software that hasn't yet made its way into CRA

## Installation

#### [NPM Registry](https://www.npmjs.com/package/state-mint)

```sh
npm i -D state-mint
```

## Basic Usage
### Customize Babel & ESLint configurations

#### 1) Adjust your `package.json`

```diff
{
  "name": "built-with-rescripts",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.6.1",
    "react-dom": "^16.6.1",
    "react-scripts": "2.1.1"
+   "rescripts": "^1.0.0"
  },
  "scripts": {
-   "start": "react-scripts start",
+   "start": "rescripts start",
-   "build": "react-scripts build",
+   "build": "rescripts build",
-   "test": "react-scripts test",
+   "test": "rescripts test",
-   "eject": "react-scripts eject"
  },
- "eslintConfig": {
-   "extends": "react-app"
- },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
```

#### 2) Add a Babel configuration at your project root
Use whatever convention you prefer: `.babelrc`, `.babelrc.js`, or `babel.config.js`

#### 4) Add an ESLint configuration at your project root
Same flexibility: `.eslint`, `.eslintrc.js`, or `eslint.config.js`


## LICENSE

MIT