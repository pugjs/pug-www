import gethub from 'gethub';

import langs from '../langs.js';
import {lang} from './utils/paths.js';

Promise.all(langs.map(l =>
  gethub('pugjs', `pug-${l}`, 'master', lang(l)).then(() => {
    console.log(`pug-${l} downloaded`);
  })
)).then(() => {
  console.log('success');
}).catch(err => {
  console.error(err);
  process.exitCode = 1;
});
