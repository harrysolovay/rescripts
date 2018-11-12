const fs = require('fs');
const path = require('path');

const rootPath = fs.realpathSync(process.cwd());

const existsInRoot = name => fs.existsSync(path.join(rootPath, name));

const reactScriptsPath = path.join(
  require.resolve('react-scripts/package.json'),
  '..',
);

module.exports = {rootPath, existsInRoot, reactScriptsPath};
