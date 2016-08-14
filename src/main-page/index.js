import * as pug from 'pug';

import {tmpl} from '../utils/paths.js';
import dynInclude from './dyninclude.js';

const {compileFile} = pug;

export default async lang => {
  return compileFile(tmpl('index'), {
    plugins: [
      dynInclude({
        lang
      })
    ]
  })({
    lang,
    pugSelf: pug
  });
};
