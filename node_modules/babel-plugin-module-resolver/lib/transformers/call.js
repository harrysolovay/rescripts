'use strict';

exports.__esModule = true;
exports.default = transformCall;

var _utils = require('../utils');

function transformCall(nodePath, state) {
  if (state.moduleResolverVisited.has(nodePath)) {
    return;
  }

  var calleePath = nodePath.get('callee');
  var isNormalCall = state.normalizedOpts.transformFunctions.some(function (pattern) {
    return (0, _utils.matchesPattern)(state.types, calleePath, pattern);
  });

  if (isNormalCall || (0, _utils.isImportCall)(state.types, nodePath)) {
    state.moduleResolverVisited.add(nodePath);
    (0, _utils.mapPathString)(nodePath.get('arguments.0'), state);
  }
}