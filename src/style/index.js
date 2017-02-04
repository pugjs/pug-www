import {readFileSync} from 'fs';
import {dirname, resolve} from 'path';

import jst from 'jstransformer';
import jstAutoprefixer from 'jstransformer-autoprefixer';
import jstScss from 'jstransformer-scss';
import {sync as nodeResolve} from 'resolve';

import config from '../config.js';

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

export default () => {
  let {body} = scss.renderFile(config.scssPath, {
    importer
  });

  body = body.replace(/@import url\(([^\)]+)\)/g, (_, p) => {
    return readFileSync(p, 'utf8');
  });

  return autoprefixer.render(body).body;
};
