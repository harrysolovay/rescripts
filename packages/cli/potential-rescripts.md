### interpretation

```json
{
  "rescripts": [
    "path/to/rescript/one",
    "path/to/rescript/two",
    [
      "node_module_rescript",
      {
        "someOption": true
      }
    ]
  ]
}
```

```json
{
  "rescripts": {
    "rescripts": [
      "path/to/rescript/one",
      "path/to/rescript/two",
      [
        "node_module_rescript",
        {
          "someOption": true
        }
      ]
    ],
    "webpack": "config/webpack",
    "devServer": "config/devServer",
    "jest": "config/jest",
    "log": "config/logs"
  }
}
```

### .rescriptrc.js

```js
module.exports = [
  'path/to/rescript/one',
  'path/to/rescript/two',
  [
    'node_module_rescript',
    {
      someOption: true,
    },
  ],
]
```

```js
module.exports = config => {
  const reconfig = {...config}
  // change it up
  return reconfig
}
```

```js
module.exports = {
  rescripts: [
    'path/to/rescript/one',
    'path/to/rescript/two',
    [
      'node_module_rescript',
      {
        someOption: true,
      },
    ],
  ],
  webpack: 'config/webpack',
  devServer: 'config/devServer',
  jest: 'config/jest',
  log: 'config/logs',
}
```
