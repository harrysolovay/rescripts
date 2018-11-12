"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _helperPluginUtils() {
  const data = require("@babel/helper-plugin-utils");

  _helperPluginUtils = function () {
    return data;
  };

  return data;
}

function _pluginSyntaxDecorators() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-decorators"));

  _pluginSyntaxDecorators = function () {
    return data;
  };

  return data;
}

var _transformer = _interopRequireDefault(require("./transformer"));

var _transformerLegacy = _interopRequireDefault(require("./transformer-legacy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const {
    legacy = false
  } = options;

  if (typeof legacy !== "boolean") {
    throw new Error("'legacy' must be a boolean.");
  }

  const {
    decoratorsBeforeExport
  } = options;

  if (decoratorsBeforeExport === undefined) {
    if (!legacy) {
      throw new Error("The decorators plugin requires a 'decoratorsBeforeExport' option," + " whose value must be a boolean. If you want to use the legacy" + " decorators semantics, you can set the 'legacy: true' option.");
    }
  } else {
    if (legacy) {
      throw new Error("'decoratorsBeforeExport' can't be used with legacy decorators.");
    }

    if (typeof decoratorsBeforeExport !== "boolean") {
      throw new Error("'decoratorsBeforeExport' must be a boolean.");
    }
  }

  return {
    inherits: _pluginSyntaxDecorators().default,

    manipulateOptions({
      generatorOpts
    }) {
      generatorOpts.decoratorsBeforeExport = decoratorsBeforeExport;
    },

    visitor: legacy ? _transformerLegacy.default : _transformer.default
  };
});

exports.default = _default;