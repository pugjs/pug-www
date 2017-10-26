import {readFileSync} from 'fs';
import {dirname, resolve} from 'path';

import jst from 'jstransformer';
import jstAutoprefixer from 'jstransformer-autoprefixer';
import jstScss from 'jstransformer-scss';
import {sync as nodeResolve} from 'resolve';

import {scss as scssPath} from '../utils/paths';

const autoprefixer = jst(jstAutoprefixer);
const scss = jst(jstScss);

const importer = [
  (url, fileContext) => {
    let file;
    const basedir = dirname(fileContext);

    if (url[0] === '~') {
      file = nodeResolve(url.substr(1), {basedir});
    } else {
      file = resolve(basedir, url);
    }

    return {file};
  }
];

export default path => {
  let {body} = scss.renderFile(scssPath(path), {
    importer
  });

  body = body.replace(/@import url\(([^)]+)\)/g, (_, p) => {
    return readFileSync(p, 'utf8');
  });

  return autoprefixer.render(body).body;
};
