'use strict';

exports.__esModule = true;
exports.default = mapToRelative;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapToRelative(cwd, currentFile, module) {
  var from = _path2.default.dirname(currentFile);
  var to = _path2.default.normalize(module);

  from = _path2.default.resolve(cwd, from);
  to = _path2.default.resolve(cwd, to);

  var moduleMapped = _path2.default.relative(from, to);
  return (0, _utils.toPosixPath)(moduleMapped);
}