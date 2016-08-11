import {dirname, join} from 'path';

import babelify from 'babelify';
import browserify from 'browserify-middleware';
import envify from 'envify';
import express from 'express';

import renderMd from './markdown';
import renderMainPage from './main-page';
import compileScss from './style';

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
    babelify.configure({
      presets: ['es2015', 'react']
    }),
    envify
  ],
  external: ['pug'],
  ignore: ['http', 'https']
}));

app.get('/css/style.css', (req, res, next) => {
  compileScss('docs.scss')
  .then(body => {
    res.type('css');
    res.send(body);
  }).catch(next);
});

app.use((req, res, next) => {
  const [, lang, ...rest] = req.path.split('/');
  rest.push((rest.pop() || 'index').replace(/\.html$/, ''));
  const path = rest.join('/');

  if (!lang) {
    return next();
  }

  (path === 'index' ? renderMainPage(lang) : renderMd(lang, path))
  .then(html => res.send(html))
  .catch(err => {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    console.log(err);
    return next();
  }).catch(next);
});

app.use(express.static(join(__dirname, '..', 'htdocs')));

export default app;
