import {runMode} from 'codemirror/addon/runmode/runmode.node';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/shell/shell';

import {runtime} from 'pug';

const normalizeMode = {
  css: 'css',
  html: 'htmlmixed',
  htmlmixed: 'htmlmixed',
  jade: 'jade',
  javascript: 'javascript',
  js: 'javascript',
  markdown: 'markdown',
  md: 'markdown',
  pug: 'jade',
  sh: 'shell',
  shell: 'shell'
};

export const getMode = mode => (
  normalizeMode[mode] || (console.error(`FIXME: recognize CodeMirror ${mode} mode`), mode)
);

export default (src, mode) => {
  let out = '';
  runMode(src, getMode(mode), (text, style) => {
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
