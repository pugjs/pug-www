import {join} from 'path';

import babelify from 'babelify';
import browserify from 'browserify-middleware';
import envify from 'envify';
import express from 'express';

import renderDocs from './docs';
import renderMainPage from './main-page';
import compileScss from './style';

const app = express();

browserify.settings.production.minify = false;
browserify.settings.production.gzip = false;

app.get('/js/pug.js', browserify(['pug'], {
  precompile: true,
  transform: [
    envify
  ],
  ignore: ['http', 'https']
}));

app.use('/js/bundle/:package', (req, res, next) => {
  const pkgs = req.params.package.split('.')[0].split(',');
  return browserify(pkgs, {
    // cache the package bundle as they take such a long time to make
    precompile: true,
    transform: [
      envify
    ]
  })(req, res, next);
});

app.use('/js', browserify(join(__dirname, 'entry'), {
  transform: [
    babelify.configure({
      presets: ['es2015', 'react']
    }),
    envify
  ],
  external: ['pug'],
  ignore: ['http', 'https']
}));

app.get('/css/style.css', (req, res) => {
  const body = compileScss('docs.scss');
  res.type('css');
  res.send(body);
});

app.use((req, res, next) => {
  const [, lang, ...rest] = req.path.split('/');
  rest.push((rest.pop() || 'index').replace(/\.html$/, ''));
  const path = rest.join('/');

  if (!lang) {
    return next();
  }

  try {
    res.send(path === 'index' ? renderMainPage(lang) : renderDocs(lang, path));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return next();
  }
});

app.use(express.static(join(__dirname, '..', 'htdocs')));

export default app;
