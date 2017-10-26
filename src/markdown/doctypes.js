import {dirname} from 'path';
import {sync as resolve} from 'resolve';

import {compile} from 'pug';
import getCodeMirrorHTML from '../utils/get-codemirror-html';

const template = compile(`
dl
  each doctype in Object.keys(doctypes)
    dt doctype #{doctype}
    dd
      pre.cm-s-default
        code!= getCodeMirrorHTML(doctypes[doctype], 'htmlmixed')`);

export default () => {
  const path = resolve('doctypes', {basedir: dirname(require.resolve('pug'))});
  const doctypes = require(path);

  return template({doctypes, getCodeMirrorHTML});
};
