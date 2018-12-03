# @rescripts/rescript-use-eslint-config

## About

Use your own ESLint configuration.

## Installation

```sh
npm i -D @rescripts/rescript-use-eslint-config
```

## Usage

#### From a `.eslintrc`:

```json
[["use-eslint-config", ".eslintrc"]]
```

> Searches for the config in your root directory.

#### From config file

Call `use-eslint-config` with `.eslintrc.js`, `.eslintrc.json`, or any other file name (must have `.js` or `.json` extension).

```json
[["use-eslint-config", "name-your-eslint-config-whatever.js"]]
```

> Searches for the config from your root directory and `node_modules`.

#### From `package.json`

```json
[["use-eslint-config", "package"]]
```

> Searches for the config within the `eslintConfig` field of your `package.json`.

#### Inline config

```json
[
  [
    "use-eslint-config",
    {
      "extends": ["react-app"],
      "plugins": ["some-plugin"],
      "rules": {
        "some-rule": 0
      }
    }
  ]
]
```
