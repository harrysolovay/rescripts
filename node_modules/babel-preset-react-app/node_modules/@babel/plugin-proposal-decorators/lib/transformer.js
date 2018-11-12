"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _core() {
  const data = require("@babel/core");

  _core = function () {
    return data;
  };

  return data;
}

function _helperSplitExportDeclaration() {
  const data = _interopRequireDefault(require("@babel/helper-split-export-declaration"));

  _helperSplitExportDeclaration = function () {
    return data;
  };

  return data;
}

function _helperReplaceSupers() {
  const data = _interopRequireDefault(require("@babel/helper-replace-supers"));

  _helperReplaceSupers = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prop(key, value) {
  if (!value) return null;
  return _core().types.objectProperty(_core().types.identifier(key), value);
}

function value(body, params = [], async, generator) {
  const method = _core().types.objectMethod("method", _core().types.identifier("value"), params, body);

  method.async = !!async;
  method.generator = !!generator;
  return method;
}

function hasDecorators({
  node
}) {
  if (node.decorators && node.decorators.length > 0) return true;
  const body = node.body.body;

  for (let i = 0; i < body.length; i++) {
    const method = body[i];

    if (method.decorators && method.decorators.length > 0) {
      return true;
    }
  }

  return false;
}

function takeDecorators({
  node
}) {
  let result;

  if (node.decorators && node.decorators.length > 0) {
    result = _core().types.arrayExpression(node.decorators.map(decorator => decorator.expression));
  }

  node.decorators = undefined;
  return result;
}

function getKey(node) {
  if (node.computed) {
    return node.key;
  } else if (_core().types.isIdentifier(node.key)) {
    return _core().types.stringLiteral(node.key.name);
  } else {
    return _core().types.stringLiteral(String(node.key.value));
  }
}

function getSingleElementDefinition(path, superRef, classRef, file) {
  const {
    node,
    scope
  } = path;
  const isMethod = path.isClassMethod();

  if (path.isPrivate()) {
    throw path.buildCodeFrameError(`Private ${isMethod ? "methods" : "fields"} in decorated classes are not supported yet.`);
  }

  new (_helperReplaceSupers().default)({
    methodPath: path,
    methodNode: node,
    objectRef: classRef,
    isStatic: node.static,
    superRef,
    scope,
    file
  }, true).replace();
  const properties = [prop("kind", _core().types.stringLiteral(isMethod ? node.kind : "field")), prop("decorators", takeDecorators(path)), prop("static", node.static && _core().types.booleanLiteral(true)), prop("key", getKey(node)), isMethod ? value(node.body, node.params, node.async, node.generator) : node.value ? value(_core().template.ast`{ return ${node.value} }`) : prop("value", scope.buildUndefinedNode())].filter(Boolean);
  return _core().types.objectExpression(properties);
}

function getElementsDefinitions(path, fId, file) {
  const elements = [];

  for (const p of path.get("body.body")) {
    if (!p.isClassMethod({
      kind: "constructor"
    })) {
      elements.push(getSingleElementDefinition(p, path.node.superClass, fId, file));
      p.remove();
    }
  }

  return _core().types.arrayExpression(elements);
}

function getConstructorPath(path) {
  return path.get("body.body").find(path => path.isClassMethod({
    kind: "constructor"
  }));
}

const bareSupersVisitor = {
  CallExpression(path, {
    initializeInstanceElements
  }) {
    if (path.get("callee").isSuper()) {
      path.insertAfter(_core().types.cloneNode(initializeInstanceElements));
    }
  },

  Function(path) {
    if (!path.isArrowFunctionExpression()) path.skip();
  }

};

function insertInitializeInstanceElements(path, initializeInstanceId) {
  const isBase = !path.node.superClass;

  const initializeInstanceElements = _core().types.callExpression(initializeInstanceId, [_core().types.thisExpression()]);

  const constructorPath = getConstructorPath(path);

  if (constructorPath) {
    if (isBase) {
      constructorPath.get("body").unshiftContainer("body", [_core().types.expressionStatement(initializeInstanceElements)]);
    } else {
      constructorPath.traverse(bareSupersVisitor, {
        initializeInstanceElements
      });
    }
  } else {
    const constructor = isBase ? _core().types.classMethod("constructor", _core().types.identifier("constructor"), [], _core().types.blockStatement([_core().types.expressionStatement(initializeInstanceElements)])) : _core().types.classMethod("constructor", _core().types.identifier("constructor"), [_core().types.restElement(_core().types.identifier("args"))], _core().types.blockStatement([_core().types.expressionStatement(_core().types.callExpression(_core().types.Super(), [_core().types.spreadElement(_core().types.identifier("args"))])), _core().types.expressionStatement(initializeInstanceElements)]));
    path.node.body.body.push(constructor);
  }
}

function transformClass(path, file) {
  const isDeclaration = path.node.id && path.isDeclaration();
  const isStrict = path.isInStrictMode();
  const {
    superClass
  } = path.node;
  path.node.type = "ClassDeclaration";
  if (!path.node.id) path.node.id = path.scope.generateUidIdentifier("class");
  const initializeId = path.scope.generateUidIdentifier("initialize");
  const superId = superClass && path.scope.generateUidIdentifierBasedOnNode(path.node.superClass, "super");
  if (superClass) path.node.superClass = superId;
  const classDecorators = takeDecorators(path);
  const definitions = getElementsDefinitions(path, path.node.id, file);
  insertInitializeInstanceElements(path, initializeId);
  const expr = _core().template.expression.ast`
      ${addDecorateHelper(file)}(
        ${classDecorators || _core().types.nullLiteral()},
        function (${initializeId}, ${superClass ? superId : null}) {
          ${path.node}
          return { F: ${_core().types.cloneNode(path.node.id)}, d: ${definitions} };
        },
        ${superClass}
      )
    `;

  if (!isStrict) {
    expr.arguments[1].body.directives.push(_core().types.directive(_core().types.directiveLiteral("use strict")));
  }

  return isDeclaration ? _core().template.ast`let ${path.node.id} = ${expr}` : expr;
}

function addDecorateHelper(file) {
  try {
    return file.addHelper("decorate");
  } catch (err) {
    if (err.code === "BABEL_HELPER_UNKNOWN") {
      err.message += "\n  '@babel/plugin-transform-decorators' in non-legacy mode" + " requires '@babel/core' version ^7.0.2 and you appear to be using" + " an older version.";
    }

    throw err;
  }
}

var _default = {
  ExportDefaultDeclaration(path) {
    let decl = path.get("declaration");
    if (!decl.isClassDeclaration() || !hasDecorators(decl)) return;
    if (decl.node.id) decl = (0, _helperSplitExportDeclaration().default)(path);
    decl.replaceWith(transformClass(decl, this.file));
  },

  Class(path) {
    if (hasDecorators(path)) {
      path.replaceWith(transformClass(path, this.file));
    }
  }

};
exports.default = _default;