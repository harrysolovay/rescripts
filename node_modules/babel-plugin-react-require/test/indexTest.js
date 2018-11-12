const babel = require('babel-core');
const assert = require('assert');

let reactPlugin;
let transform;

try {
  reactPlugin = require('../lib-cov/index').default; // eslint-disable-line import/no-unresolved
} catch (error) {
  reactPlugin = require('../src/index').default;
}

const somePluginEnter = ({ types: t }) => ({
  visitor: {
    Program(path) {
      path.unshiftContainer('body', t.importDeclaration([
        t.importDefaultSpecifier(t.identifier('React')),
      ], t.stringLiteral('react')));
    },
  },
});

const somePluginExit = ({ types: t }) => ({
  visitor: {
    Program: {
      exit(path) {
        path.unshiftContainer('body', t.importDeclaration([
          t.importDefaultSpecifier(t.identifier('React')),
        ], t.stringLiteral('react')));
      },
    },
  },
});

const somePluginCrazy = () => ({
  visitor: {
    Program(_, { file }) {
      file.get('ourPath').remove();
    },
  },
});

const genericInput = 'export default class Component {render() {return <div />}}';
const genericOutput = 'import React from "react";\nexport default class Component {\n  render() {\n    return <div />;\n  }\n}';

describe('babel-plugin-react', () => {
  beforeEach(() => {
    transform = (code, pluginsBefore = [], pluginsAfter = []) => babel.transform(code, {
      plugins: ['syntax-jsx', ...pluginsBefore, reactPlugin, ...pluginsAfter],
    }).code;
  });

  it('should return transpiled code with required React', () => {
    const transformed = transform(genericInput);

    assert.equal(transformed, genericOutput);
  });

  it('should return not transpiled code', () => {
    const transformed = transform('console.log("hello world")');

    assert.equal(transformed, 'console.log("hello world");');
  });

  it('should check that plugin does not import React twice', () => {
    const transformed = transform('class Component{render(){return <div/>}} class Component2{render(){return <div />}}');

    assert.equal(transformed, 'import React from "react";\nclass Component {\n  render() {\n    return <div />;\n  }\n}'
      + 'class Component2 {\n  render() {\n    return <div />;\n  }\n}');
  });

  it('should does not replace users import on plugins import', () => {
    const transformed = transform('import React from"react/addons"\nclass Component{render(){return <div/>}}');

    assert.equal(transformed, 'import React from "react/addons";\nclass Component {\n  render() {\n    return <div />;\n  }\n}');
  });

  it('should get along with other plugins which add React import', () => {
    assert.equal(transform(genericInput, [somePluginEnter]), genericOutput);
    assert.equal(transform(genericInput, [somePluginExit]), genericOutput);
    assert.equal(transform(genericInput, [], [somePluginEnter]), genericOutput);
    assert.equal(transform(genericInput, [], [somePluginExit]), genericOutput);
  });

  it('should not blow up if another plugin removes our import', () => {
    assert.equal(transform(genericInput, [], [somePluginCrazy]), 'export default class Component {\n  render() {\n    return <div />;\n  }\n}');
  });
});
