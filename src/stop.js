import {createServer} from 'http';
import {join} from 'path';
import {parse as urlParse} from 'url';

import {removeAsync} from 'fs-extra-promise';
import * as stop from 'stop';

import langs from '../langs';
import createApp, {setEnv} from './index';

setEnv('production');

const server = createServer(createApp());
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
  return stop.getWebsiteStream(langs.reduce((prev, lang) => lang === 'en' ? prev : prev.concat([
    `${lang}/`,
    `${lang}/api/getting-started.html`
  ]), [
    '',
    'api/getting-started.html'
  ]).map(url => `http://localhost:${port}/${url}`), {
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
  server.close();
}).catch(err => {
  console.error(err);
  process.exitCode = 1;
  server.close();
});
