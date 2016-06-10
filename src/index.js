import {readFileSync} from 'fs';
import {dirname, resolve} from 'path';
import Promise from 'promise';
import nodeResolve from 'resolve';
import babelify from 'babelify';
import browserify from 'browserify-middleware';
import express from 'express';
import request from 'then-request';
import renderMd from './markdown';
const scss = require('jstransformer')(require('jstransformer-scss'));

const app = express();

// TODO: envify
app.get('/docs.bundle.js', browserify(__dirname + '/entry/docs.js', {
  transform: [
    babelify
  ]
}));
const styleCache = {};
app.get('/style.css', (req, res, next) => {
  const src = scss.renderFile(__dirname + '/../scss/docs.scss', {
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
  src.replace(/\@import url\(([^\)]+)\)/g, (_, path) => paths.push(path));
  Promise.all(paths.map(p => {
    if (/^https?\:\/\//.test(p)) {
      if (styleCache[p]) {
        contents[p] = styleCache[p];
      } else {
        return request('GET', p).getBody('utf8').then(body => {
          styleCache[p] = body;
          contents[p] = body
        });
      }
    } else {
      contents[p] = readFileSync(p, 'utf8');
    }
  })).done(() => {
    res.type('css');
    res.send(src.replace(/\@import url\(([^\)]+)\)/g, (_, path) => contents[path]));
  }, next);
});

app.use((req, res, next) => {
  let src, filename;
  try {
    filename = resolve('../pug-en/src/' + req.path + '.md');
    src = readFileSync(filename, 'utf8');
  } catch (ex) {
    if (ex.code !== 'ENOENT') throw ex;
    try {
      filename = resolve('../pug-en/src/' + req.path + '/index.md');
      src = readFileSync(filename, 'utf8');
    } catch (ex) {
      if (ex.code !== 'ENOENT') throw ex;
      return next();
    }
  }
  let html = renderMd('en', src, filename);
  res.send(html);
});

app.listen(process.env.PORT || 3000);
console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
