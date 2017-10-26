import gethub from 'gethub';

import langs from '../langs';
import {lang} from './utils/paths';

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
