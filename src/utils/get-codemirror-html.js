import {runtime} from '../../../pug';
import {runMode} from 'codemirror/addon/runmode/runmode.node';

export default (src, mode) => {
  let out = '';
  runMode(src, mode, (text, style) => {
    if (style) {
      out += `<span class="${style.split(' ').map(s => `cm-${s}`).join(' ')}">`;
    }

    out += runtime.escape(text);

    if (style) {
      out += '</span>';
    }
  });
  return out;
};
