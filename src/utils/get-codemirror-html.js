import {runtime} from '../../../pug';
import {runMode} from 'codemirror/addon/runmode/runmode.node';

export const normalizeMode = {
  html: 'htmlmixed',
  htmlmixed: 'htmlmixed',
  jade: 'jade',
  javascript: 'javascript',
  js: 'javascript',
  pug: 'jade',
  sh: 'shell',
  shell: 'shell'
};

export default (src, mode) => {
  let out = '';
  runMode(src, normalizeMode[mode] || (console.error(`FIXME: recognize CodeMirror ${mode} mode`), mode), (text, style) => {
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
