// Based on uglify-to-browserify
import {readFileSync as read} from 'fs';
import {resolve as pathResolve} from 'path';
import {sync as resolve} from 'resolve';

export default () => {
  const path = resolve('uglify-js', {basedir: pathResolve(__dirname, '../../external/pug')});
  const uglify = require(path);

  let src =
`var sys = require("util");
var MOZ_SourceMap = require("source-map");
var UglifyJS = exports;
${uglify.FILES.map(path => read(path, 'utf8')).join('\n')}

`;

  const ast = uglify.parse(src);
  ast.figure_out_scope();

  const variables = ast.variables
    .map((node, name) => name);

  src += '\n\n';
  src += variables.map(v => `exports.${v} = ${v};`).join('\n');
  src += '\n\n';

  src += 'exports.AST_Node.warn_function = function (txt) { if (typeof console != "undefined" && typeof console.warn === "function") console.warn(txt) }\n\n';

  src += `exports.minify = ${uglify.minify.toString()};\n\n`;
  src += `exports.describe_ast = ${uglify.describe_ast.toString()};`;

  return src;
};
