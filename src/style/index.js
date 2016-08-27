import {readFileSync} from 'fs';
import {dirname, resolve} from 'path';

import jst from 'jstransformer';
import jstAutoprefixer from 'jstransformer-autoprefixer';
import jstScss from 'jstransformer-scss';
import {sync as nodeResolve} from 'resolve';

const autoprefixer = jst(jstAutoprefixer);
const scss = jst(jstScss);

const importer = [
  (url, fileContext) => {
    let file;

    if (url[0] === '~') {
      file = nodeResolve(url.substr(1), {basedir: dirname(fileContext)});
    } else {
      file = resolve(dirname(fileContext), url);
    }

    return {file};
  }
];

export default path => {
  let {body} = scss.renderFile(`${__dirname}/../../scss/${path}`, {
    importer
  });

  const paths = [];
  const contents = {};
  body.replace(/@import url\(([^\)]+)\)/g, (_, path) => paths.push(path));

  paths.forEach(p => {
    contents[p] = readFileSync(p, 'utf8');
  });

  body = body.replace(/@import url\(([^\)]+)\)/g, (_, path) => contents[path]);

  const {body: prefixed} = autoprefixer.render(body);

  return prefixed;
};
