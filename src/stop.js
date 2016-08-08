import {createServer} from 'http';
import {parse as urlParse} from 'url';
import {join} from 'path';
import stop from 'stop';

import app from './index.js';

process.env.NODE_ENV = 'production';

const server = createServer(app);
server.on('listening', () => {
  const {port} = server.address();
  console.log(`listening at http://localhost:${port}`);

  stop.getWebsiteStream(`http://localhost:${port}/en/api/reference.html`, {
    filter: currentURL => urlParse(currentURL).hostname === 'localhost',
    parallel: 1
  })
  .syphon(stop.minifyJS())
  .syphon(stop.minifyCSS())
  .syphon(stop.log())
  .syphon(stop.checkStatusCodes([200, 404]))
  .syphon(stop.writeFileSystem(join(__dirname, '..', 'output')))
  .wait().done(() => {
    console.log('success');
    server.close(() => {
      // HACK: for some reason, server.close() doesn't make the process exit
      process.exit(0);
    });
  });
});
server.listen(0);
