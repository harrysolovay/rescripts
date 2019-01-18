# @rescripts/rescript-use-tslint-config

## About

Use your own TSLint configuration.

## Installation

```sh
npm i -D @rescripts/rescript-use-tslint-config
```

## Usage

#### From config file

Call `use-tslint-config` with `tslint.js`, `tslint.json`, or any other file name (must have `.js` or `.json` extension).

```json
[["use-tslint-config", "tslint.json"]]
```

> Searches for the config from your root directory and `node_modules`.
