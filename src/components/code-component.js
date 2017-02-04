import {runMode} from 'codemirror/addon/runmode/runmode.node';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/pug/pug';
import 'codemirror/mode/shell/shell';
import React from 'react';

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

function CodeComponent({lang, code}) {
  if (!lang) {
    return <pre><code>{code}</code></pre>;
  }
  const tokens = [];
  runMode(code, getMode(lang), (text, style) => {
    if (style) {
      const className = style.split(' ').map(s => `cm-${s}`).join(' ');
      tokens.push(pug`span(key=tokens.length className=className)= text`);
    } else {
      tokens.push(text);
    }
  });
  return pug`
    pre.cm-s-default
      code= tokens
  `;
}

export default CodeComponent;
