import {readFileAsync} from 'fs-extra-promise';
import {dirname, join, resolve} from 'path';

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

export default async (path) => {
  let {body} = await scss.renderFileAsync(`${__dirname}/../../scss/${path}`, {
    importer
  });

  const paths = [];
  const contents = {};
  body.replace(/@import url\(([^\)]+)\)/g, (_, path) => paths.push(path));

  await Promise.all(paths.map(p => {
    return readFileAsync(p, 'utf8').then(data => contents[p] = data);
  }));

  body = body.replace(/@import url\(([^\)]+)\)/g, (_, path) => contents[path]);

  const {body: prefixed} = await autoprefixer.renderAsync(body);

  return prefixed;
};
