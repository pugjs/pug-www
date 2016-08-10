import {removeAsync} from 'fs-extra-promise';
import {createServer} from 'http';
import {parse as urlParse} from 'url';
import {join} from 'path';
import stop from '@timothygu/stop';

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
  return stop.getWebsiteStream(`http://localhost:${port}/en/api/reference.html`, {
    filter: currentURL => urlParse(currentURL).hostname === 'localhost',
    parallel: 1
  })
  .syphon(stop.minifyJS())
  .syphon(stop.minifyCSS())
  .syphon(stop.log())
  .syphon(stop.checkStatusCodes([200, /* FIXME */ 404]))
  .syphon(stop.writeFileSystem(output))
  .wait();
}).then(() => {
  console.log('success');
  server.close(() => {
    // HACK: for some reason, server.close() doesn't make the process exit
    process.exit(0);
  });
});
