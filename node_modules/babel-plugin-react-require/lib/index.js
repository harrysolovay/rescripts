'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      Program: {
        enter: function (path, _ref2) {
          var file = _ref2.file;

          var ourNode = t.importDeclaration([t.importDefaultSpecifier(t.identifier('React'))], t.stringLiteral('react'));

          // Add an import early, so that other plugins get to see it
          file.set('ourPath', path.unshiftContainer('body', ourNode)[0]);
        },
        exit: function (_, _ref3) {
          var file = _ref3.file;

          // If our import is still intact and we haven't encountered any JSX in
          // the program, then we just remove it. There's an edge case, where
          // some other plugin could add JSX in its `Program.exit`, so our
          // `JSXOpeningElement` will trigger only after this method, but it's
          // likely that said plugin will also add a React import too.
          var ourPath = file.get('ourPath');
          if (ourPath && !file.get('hasJSX')) {
            if (!ourPath.removed) ourPath.remove();
            file.set('ourPath', undefined);
          }
        }
      },

      ImportDeclaration: function (path, _ref4) {
        var file = _ref4.file;

        // Return early if this has nothing to do with React
        if (path.node.specifiers.every(x => x.local.name !== 'React')) return;

        // If our import is still intact and we encounter some other import
        // which also imports `React`, then we remove ours.
        var ourPath = file.get('ourPath');
        if (ourPath && path !== ourPath) {
          if (!ourPath.removed) ourPath.remove();
          file.set('ourPath', undefined);
        }
      },
      JSXOpeningElement: function (_, _ref5) {
        var file = _ref5.file;

        file.set('hasJSX', true);
      }
    }
  };
};