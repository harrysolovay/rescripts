# @rescripts/rescript-use-rewire

## About

Use "rewires" made for [react-app-rewired](https://github.com/timarney/react-app-rewired).

## Installation

```sh
npm i -D @rescripts/rescript-use-rewire
```

> make sure you've also installed the rewire you wish to use

## Usage

```json
[["use-rewire", "name-of-rewire", "other arguments"]]
```

## Example

```js
module.exports = [
  [
    'use-rewire',
    'react-app-rewire-compression-plugin',
    {test: /\.js(\?.*)?$/i, cache: true},
  ],
]
```
