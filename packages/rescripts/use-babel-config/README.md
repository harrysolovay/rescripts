# @rescripts/rescript-use-babel-config

## About

Use your own Babel configuration. You probably want to use the Create React App babel config as a starting point:

```json
{
  "plugins": [
    [
      "babel-plugin-named-asset-import",
      {
        "loaderMap": {
          "svg": {
            "ReactComponent": "@svgr/webpack?-svgo,+titleProp,+ref![path]"
          }
        }
      }
    ]
  ],
  "presets": [
    [
      "react-app",
      {
        "runtime": "automatic"
      }
    ]
  ]
}
```

## Installation

```sh
npm i -D @rescripts/rescript-use-babel-config
```

## Usage

#### From a `.babelrc`:

```json
[["use-babel-config", ".babelrc"]]
```

> Searches for the config in your root directory.

#### From config file

Call `use-babel-config` with `.babelrc.js`, `.babelrc.json`, or any other file name (must have `.js` or `.json` extension).

```json
[["use-babel-config", "name-your-babel-config-whatever.js"]]
```

> Searches for the config from your root directory and `node_modules`.

#### From `package.json`

```json
[["use-babel-config", "package"]]
```

> Searches for the config within the `babel` field of your `package.json`.

#### Inline config

```json
[
  [
    "use-babel-config",
    {
      "presets": ["react-app"],
      "plugins": ["some-plugin"]
    }
  ]
]
```
