# @rescripts/rescript-env

## About

Use your own Babel, ESLint and TSLint configurations. This rescript is a zero-config combination of three other rescripts:

- [@rescripts/rescript-use-babel-config](https://github.com/rescripts/rescripts/tree/master/packages/rescripts/use-babel-config)
- [@rescripts/rescript-use-eslint-config](https://github.com/rescripts/rescripts/tree/master/packages/rescripts/use-eslint-config)
- [@rescripts/rescript-use-tslint-config](https://github.com/rescripts/rescripts/tree/master/packages/rescripts/use-tslint-config)

## Installation

```sh
npm i -D @rescripts/rescript-env
```

## Usage

```json
["env"]
```

> Babel
>
> > Searches for a Babel config from your `package.json`'s `babel` field, or from files named `.babelrc`, `.babelrc.js`, `.babelrc.json` or `babel.config.js` in your root directory.

> ESLint
>
> > Searches for an ESLint config from your `package.json`'s `eslintConfig` field, or from files named `.eslintrc`, `.eslintrc.js`, `.eslintrc.json` or `eslint.config.js` in your root directory.

> TSLint
>
> > Searches for a TSLint config from files named either `tslint.js` or `tslint.json` in your root directory.
