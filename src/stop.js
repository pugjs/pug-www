import {createServer} from 'http';
import {join} from 'path';
import {parse as urlParse} from 'url';

import {removeAsync} from 'fs-extra-promise';
import stop from '@timothygu/stop';

import langs from '../langs.json';
import app from './index.js';

process.env.NODE_ENV = 'production';

const server = createServer(app);
const output = join(__dirname, '..', 'output');

removeAsync(output).then(() => {
  return new Promise((resolve, reject) => {
    server.listen(0);
    server.on('error', reject);
    server.on('listening', () => {
      const {port} = server.address();

      console.log(`listening at http://localhost:${port}`);
      resolve(port);
      server.removeListener('error', reject);
    });
  });
}).then(port => {
  return stop.getWebsiteStream(langs.reduce((prev, lang) => prev.concat([
    `${lang}/`,
    `${lang}/api/getting-started.html`
  ]), []).map(url => `http://localhost:${port}/${url}`), {
    filter: currentURL => urlParse(currentURL).hostname === 'localhost',
    parallel: 1
  })
  .syphon(stop.minifyJS({
    warnings: false
  }))
  .syphon(stop.minifyCSS())
  .syphon(stop.log())
  .syphon(stop.checkStatusCodes([200]))
  .syphon(stop.writeFileSystem(output))
  .wait();
}).then(() => {
  console.log('success');
  server.close(() => {
    // HACK: for some reason, server.close() doesn't make the process exit
    process.exit(0);
  });
});
