import gethub from 'gethub';

import {md} from './utils/paths.js';
import langs from '../langs.json';

Promise.all(langs.map(lang =>
  gethub('pugjs', `pug-${lang}`, 'master', md(lang)).then(() => {
    console.log(`pug-${lang} downloaded`);
  })
)).then(() => {
  console.log('success');
}).catch(err => {
  console.error(err);
  process.exitCode = 1;
})
