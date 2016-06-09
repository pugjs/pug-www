import {readFileSync} from 'fs';
import {resolve} from 'path';
import express from 'express';
import renderMd from './markdown';

const app = express();

app.use(express.static(resolve(__dirname + '/../out/')));

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
