'use strict';

exports.__esModule = true;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reselect = require('reselect');

var _findBabelConfig = require('find-babel-config');

var _findBabelConfig2 = _interopRequireDefault(_findBabelConfig);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _pkgUp = require('pkg-up');

var _pkgUp2 = _interopRequireDefault(_pkgUp);

var _resolvePath = require('./resolvePath');

var _resolvePath2 = _interopRequireDefault(_resolvePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultExtensions = ['.js', '.jsx', '.es', '.es6', '.mjs'];
var defaultTransformedFunctions = ['require', 'require.resolve', 'System.import',

// Jest methods
'jest.genMockFromModule', 'jest.mock', 'jest.unmock', 'jest.doMock', 'jest.dontMock', 'jest.setMock', 'require.requireActual', 'require.requireMock'];

function isRegExp(string) {
  return string.startsWith('^') || string.endsWith('$');
}

var specialCwd = {
  babelrc: function babelrc(startPath) {
    return _findBabelConfig2.default.sync(startPath).file;
  },
  packagejson: function packagejson(startPath) {
    return _pkgUp2.default.sync(startPath);
  }
};

function normalizeCwd(optsCwd, currentFile) {
  var cwd = void 0;

  if (optsCwd in specialCwd) {
    var startPath = currentFile === 'unknown' ? './' : currentFile;

    var computedCwd = specialCwd[optsCwd](startPath);

    cwd = computedCwd ? _path2.default.dirname(computedCwd) : null;
  } else {
    cwd = optsCwd;
  }

  return cwd || process.cwd();
}

function normalizeRoot(optsRoot, cwd) {
  if (!optsRoot) {
    return [];
  }

  var rootArray = Array.isArray(optsRoot) ? optsRoot : [optsRoot];

  return rootArray.map(function (dirPath) {
    return _path2.default.resolve(cwd, dirPath);
  }).reduce(function (resolvedDirs, absDirPath) {
    if (_glob2.default.hasMagic(absDirPath)) {
      var roots = _glob2.default.sync(absDirPath).filter(function (resolvedPath) {
        return _fs2.default.lstatSync(resolvedPath).isDirectory();
      });

      return [].concat(resolvedDirs, roots);
    }

    return [].concat(resolvedDirs, [absDirPath]);
  }, []);
}

function getAliasTarget(key, isKeyRegExp) {
  var regExpPattern = isKeyRegExp ? key : `^${key}(/.*|)$`;
  return new RegExp(regExpPattern);
}

function getAliasSubstitute(value, isKeyRegExp) {
  if (typeof value === 'function') {
    return value;
  }

  if (!isKeyRegExp) {
    return function (_ref) {
      var match = _ref[1];
      return `${value}${match}`;
    };
  }

  var parts = value.split('\\\\');

  return function (execResult) {
    return parts.map(function (part) {
      return part.replace(/\\\d+/g, function (number) {
        return execResult[number.slice(1)] || '';
      });
    }).join('\\');
  };
}

function normalizeAlias(optsAlias) {
  if (!optsAlias) {
    return [];
  }

  var aliasArray = Array.isArray(optsAlias) ? optsAlias : [optsAlias];

  return aliasArray.reduce(function (aliasPairs, alias) {
    var aliasKeys = Object.keys(alias);

    aliasKeys.forEach(function (key) {
      var isKeyRegExp = isRegExp(key);
      aliasPairs.push([getAliasTarget(key, isKeyRegExp), getAliasSubstitute(alias[key], isKeyRegExp)]);
    });

    return aliasPairs;
  }, []);
}

function normalizeTransformedFunctions(optsTransformFunctions) {
  if (!optsTransformFunctions) {
    return defaultTransformedFunctions;
  }

  return [].concat(defaultTransformedFunctions, optsTransformFunctions);
}

exports.default = (0, _reselect.createSelector)(
// The currentFile should have an extension; otherwise it's considered a special value
function (currentFile) {
  return currentFile.includes('.') ? _path2.default.dirname(currentFile) : currentFile;
}, function (_, opts) {
  return opts;
}, function (currentFile, opts) {
  var cwd = normalizeCwd(opts.cwd, currentFile);
  var root = normalizeRoot(opts.root, cwd);
  var alias = normalizeAlias(opts.alias);
  var transformFunctions = normalizeTransformedFunctions(opts.transformFunctions);
  var extensions = opts.extensions || defaultExtensions;
  var stripExtensions = opts.stripExtensions || extensions;
  var resolvePath = opts.resolvePath || _resolvePath2.default;

  return {
    cwd,
    root,
    alias,
    transformFunctions,
    extensions,
    stripExtensions,
    resolvePath
  };
});