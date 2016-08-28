import {join} from 'path';

import babelify from 'babelify';
import browserify from 'browserify-middleware';
import envify from 'envify';
import express from 'express';

import langs from '../langs.json';
import renderMainPage from './main-page';
import renderPage from './page';
import compileScss from './style';

browserify.settings.production.minify = false;
browserify.settings.production.gzip = false;

export const setEnv = env => {
  process.env.NODE_ENV = env;
  browserify.settings.mode = env;
};

export default () => {
  const app = express();

  app.get('/js/pug.js', browserify(['pug'], {
    precompile: true,
    transform: [
      envify
    ],
    ignore: ['http', 'https']
  }));

  app.get('/js/filters.js', browserify([
    'jstransformer-babel',
    'babel-preset-es2015',
    'jstransformer-cdata-js',
    'jstransformer-coffee-script',
    'jstransformer-markdown-it'
  ], {
    transform: [
      envify
    ]
  }));

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
    const body = compileScss('docs');
    res.type('css');
    res.send(body);
  });

  app.use((req, res, next) => {
    let [, lang, ...rest] = req.path.split('/');
    rest.push((rest.pop() || 'index').replace(/\.html$/, ''));

    if (!langs.includes(lang)) {
      if (lang) {
        rest.unshift(lang);
      }
      lang = 'en';
    }

    const path = rest.join('/');

    try {
      res.send(path === 'index' ? renderMainPage(lang) : renderPage(lang, path));
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
      return next();
    }
  });

  app.use(express.static(join(__dirname, '..', 'htdocs')));

  return app;
};
