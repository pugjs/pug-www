import gethub from 'gethub';

import langs from '../langs.json';
import {md} from './utils/paths.js';

Promise.all(langs.map(lang =>
  gethub('pugjs', `pug-${lang}`, 'master', md(lang)).then(() => {
    console.log(`pug-${lang} downloaded`);
  })
)).then(() => {
  console.log('success');
}).catch(err => {
  console.error(err);
  process.exitCode = 1;
});
