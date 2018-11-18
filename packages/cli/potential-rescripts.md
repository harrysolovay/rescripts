### interpretation

```js
const {paths, isLiteral} = require('@rescripts/utilities')
const {appPath} = paths
const {join} = require('path')

const isConfig = config =>
  typeof config === 'function' ||
  (isLiteral(config) &&
    !!!(
      !config.rescripts &&
      !config.webpack &&
      !config.devServer &&
      !config.jest
    ))

// takes in a path or module name
// outputs the absolute path
const resolveRescript = (pathOrModuleName, parentPath = 'root/') => {}

// take in an absolute path
// outputs the config
const requireRescript = rescriptPath => {}

// takes in config or path or module
// outputs config
const normalizeRescript = configOrPathOrModule =>
  isConfig(configOrPathOrModule)
    ? configOrPathOrModule
    : requireRescript(configOrPathOrModule)

// takes in [configOrPathOrModule, options]
// outputs [config, options]
const normalizeRescriptWithOptions = ([rescript, options]) => [
  normalizeRescript(rescript),
  options,
]

// takes in [configOrPathOrModule, options] | configOrPathOrModule
// outputs [config, options] | [config]
const normalizeRescriptWithOrWithoutOptions = rescript =>
  Array.isArray(rescript)
    ? normalizeRescriptWithOptions(rescript)
    : [normalizeRescript(rescript)]

// takes in Array<[configOrPathOrModule, options] | configOrPathOrModule>
// outputs Array<[config, options] | [config]>
const normalizeRescripts = rescripts =>
  rescripts.map(normalizeRescriptWithOrWithoutOptions)

const normalizeRescript = source => {
  if (Array.isArray(source)) {
    return normalizeRescripts(source)
  } else if (typeof source === 'function') {
    return source
  } else if (isConfig(source)) {
    const normalized = {rescripts: normalizeRescripts(rescripts)}
    const otherProcesses = ['webpack', 'devServer', 'jest']
    otherProcesses.forEach(p => {
      if (source[p]) {
        normalized[p] = source[p]
      }
    })
    return normalized
  }
}kjasdfcbuffy

```

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
