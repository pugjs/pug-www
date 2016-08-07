import {readFileSync} from 'fs';
import {dirname, join, resolve} from 'path';

import acceptLanguage from 'accept-language';
import babelify from 'babelify';
import browserify from 'browserify-middleware';
import envify from 'envify';
import express from 'express';
import jst from 'jstransformer';
import jstScss from 'jstransformer-scss';
import nodeResolve from 'resolve';
import Promise from 'promise';
import request from 'then-request';
import renderMd from './markdown';

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
  const src = scss.renderFile(join(__dirname, '..', 'scss', 'docs.scss'), {
    importer: [
      (url, fileContext) => {
        if (url[0] === '~') {
          return {file: nodeResolve.sync(url.substr(1), {basedir: dirname(fileContext)})};
        } else {
          return {file: resolve(dirname(fileContext), url)};
        }
      },
    ],
  }).body;
  const paths = [];
  const contents = {};
  src.replace(/@import url\(([^\)]+)\)/g, (_, path) => paths.push(path));
  Promise.all(paths.map(p => {
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
  })).done(() => {
    res.type('css');
    res.send(src.replace(/@import url\(([^\)]+)\)/g, (_, path) => contents[path]));
  }, next);
});

app.use((req, res, next) => {
  const [, lang, ...rest] = req.path.split('/');
  rest.push((rest.pop() || 'index').replace(/\.html$/, ''));

  let src;
  try {
    src = readFileSync(`../pug-${lang}/src/${rest.join('/')}.md`, 'utf8');
  } catch (ex) {
    if (ex.code !== 'ENOENT') throw ex;
    return next();
  }
  let html = renderMd(lang, src);
  res.send(html);
});

app.use(express.static(join(__dirname, '..', 'htdocs')));

export default app;
