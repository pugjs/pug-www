import {dirname, relative} from 'path';
import express from 'express';
import React from 'react';
import ReactServer from 'react-dom/server';
import jsStringify from 'js-stringify';
import {compileFile as pug} from 'pug';
import Promise from 'promise';
import parsePath from './utils/parse-path';
import readFile from './utils/read-file';
import extractMetadata from './utils/extract-metadata';
import compileMarkdown from './utils/compile-markdown';
import App from './components/app';
import compileScss from './style';

const app = express();

const templates = {
  generic: pug(__dirname + '/templates/generic.pug'),
}

app.get('/css/style.css', (req, res) => {
  const body = compileScss('docs');
  res.type('css');
  res.send(body);
});

app.use((req, res, next) => {
  const {lang, path} = parsePath(req.path);
  return Promise.all([
    readFile(lang, '/src' + path + '.md', 'utf8').catch(ex => {
      if (ex.code !== 'ENOENT') {
        throw ex;
      }
      return readFile(lang, '/src' + path + '/index.md', 'utf8');
    }),
    readFile(lang, '/strings.json', 'utf8').then(JSON.parse),
  ]).then(([contents, strings]) => {
    const {attributes, body: src} = extractMetadata(contents);
    const body = compileMarkdown(req.path, src);
    const rawHtml = ReactServer.renderToString(pug`
      App(lang=lang path=path attributes=attributes body=body strings=strings)
    `);
    return templates.generic({
      lang,
      path,
      attributes,
      '_': strings,

      dirname,
      relative,
      jsStringify,

      rawHtml,
      id: attributes.id,
    });
  }).done(result => res.send(result), next);
});

export default app;
