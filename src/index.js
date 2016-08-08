import {readFileSync} from 'fs';
import {dirname, join, resolve} from 'path';

import babelify from 'babelify';
import browserify from 'browserify-middleware';
import envify from 'envify';
import express from 'express';
import jst from 'jstransformer';
import jstAutoprefixer from 'jstransformer-autoprefixer';
import jstScss from 'jstransformer-scss';
import {sync as nodeResolve} from 'resolve';
import Promise from 'promise';
import request from 'then-request';
import renderMd from './markdown';

const autoprefixer = jst(jstAutoprefixer);
const scss = jst(jstScss);

const app = express();

browserify.settings.mode = 'development';

app.get('/js/pug.js', browserify(['pug'], {
  transform: [
    envify
  ],
  ignore: ['http', 'https']
}));
app.use('/js', browserify(join(__dirname, 'entry'), {
  transform: [
    babelify,
    envify
  ],
  external: ['pug'],
  ignore: ['http', 'https']
}));

const styleCache = {};
app.get('/css/style.css', (req, res, next) => {
  scss.renderFileAsync(join(__dirname, '..', 'scss', 'docs.scss'), {
    importer: [
      (url, fileContext) => {
        let file;

        if (url[0] === '~') {
          file = nodeResolve(url.substr(1), {basedir: dirname(fileContext)});
        } else {
          file = resolve(dirname(fileContext), url);
        }

        return {file};
      }
    ]
  }).then(({body}) => {
    const paths = [];
    const contents = {};
    body.replace(/@import url\(([^\)]+)\)/g, (_, path) => paths.push(path));

    return Promise.all(paths.map(p => {
      if (/^https?:\/\//.test(p)) {
        if (styleCache[p]) {
          contents[p] = styleCache[p];
        } else {
          return request('GET', p).getBody('utf8').then(body => {
            styleCache[p] = body;
            contents[p] = body;
          });
        }
      } else {
        contents[p] = readFileSync(p, 'utf8');
      }

      return null;
    })).then(() => {
      return body.replace(/@import url\(([^\)]+)\)/g, (_, path) => contents[path]);
    });
  }).then(body => {
    return autoprefixer.renderAsync(body, {});
  }).then(({body}) => {
    res.type('css');
    res.send(body);
  }).catch(next);
});

app.use((req, res, next) => {
  const [, lang, ...rest] = req.path.split('/');
  rest.push((rest.pop() || 'index').replace(/\.html$/, ''));

  let src;
  try {
    src = readFileSync(`../pug-${lang}/src/${rest.join('/')}.md`, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return next();
  }
  const html = renderMd(lang, src);
  res.send(html);
});

app.use(express.static(join(__dirname, '..', 'htdocs')));

export default app;
