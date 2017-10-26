import {runMode} from 'codemirror/addon/runmode/runmode.node';
/* eslint-disable import/no-unassigned-import */
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/pug/pug';
import 'codemirror/mode/shell/shell';
/* eslint-enable import/no-unassigned-import */

import {runtime} from 'pug';

const normalizeMode = {
  css: 'css',
  html: 'htmlmixed',
  htmlmixed: 'htmlmixed',
  javascript: 'javascript',
  js: 'javascript',
  markdown: 'markdown',
  md: 'markdown',
  pug: 'pug',
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
