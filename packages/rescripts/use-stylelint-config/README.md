# @rescripts/rescript-use-stylelint-config

## About

Use your own Stylelint configuration (Works with styles loaded via [postcss-loader](https://github.com/postcss/postcss-loader) (CSS, SCSS, etc.) and CSS-in-JS ([styled-components](https://github.com/styled-components/styled-components), [emotion](https://github.com/emotion-js/emotion)))

## Installation

```sh
npm i -D @rescripts/rescript-use-stylelint-config
```

## Usage

#### From a `.stylelintrc`:

```json
[["use-stylelint-config", ".stylelintrc"]]
```

> Searches for the config in your root directory.

#### From config file

Call `use-stylelint-config` with `.stylelintrc.js`, `.stylelintrc.json`, or any other file name (must have `.js` or `.json` extension).

```json
[["use-stylelint-config", "name-your-stylelint-config-whatever.js"]]
```

> Searches for the config from your root directory and `node_modules`.
