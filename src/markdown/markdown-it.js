import {html as beautifyHTML} from 'js-beautify';
import MarkdownIt from 'markdown-it';
import mdItAnchor from 'markdown-it-anchor';
import mdItContainer from 'markdown-it-container';
import {render as pugRender} from 'pug';

import getCodeMirrorHTML from '../utils/get-codemirror-html.js';
import renderDoctypes from './doctypes.js';
import renderParams from './parameter-list.js';
import renderPreview from './preview.js';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';

const md = MarkdownIt({
  html: true,
  typographer: true
});

md.use(mdItAnchor, {
  level: 2,
  permalink: true,
  permalinkClass: 'small'
});

md.use(function mdItCodeBlock(md, name, options) {
  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    let token = tokens[idx];
    let info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    let lang = '';
    let config = [];
    let str = token.content;

    if (info) {
      let splitted = info.split(/\s+/g);
      lang = splitted[0];
      config = splitted.slice(1);
      token.attrJoin('class', options.langPrefix + lang);
    }

    if (lang.indexOf('pug-preview') === 0) {
      return renderPreview({str, lang, config, env}) + '\n';
    } else if (lang.indexOf('parameter-list') === 0) {
      return renderParams({md, str, lang}) + '\n';
    } else if (lang === 'doctypes') {
      return renderDoctypes() + '\n';
    } else if (lang) {
      let highlighted = getCodeMirrorHTML(str, lang);
      return `<pre class="cm-s-default"><code${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`;
    } else {
      return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>\n`;
    }
  };
});

md.use(mdItContainer, 'card', {
  validate(params) {
    return /^float\s+(.*)$/.test(params.trim());
  },
  render(tokens, idx) {
    let tok = tokens[idx];
    let m = tok.info.trim().match(/^float\s+(.*)$/);

    if (tok.nesting === 1) {
      let className = {
        danger: 'danger',
        note: 'info'
      }[m[1].trim()];
      let title = {
        danger: 'Danger',
        note: 'Note'
      }[m[1].trim()];

      return `<div class="alert alert-${className}"><p><strong>${title}</strong></p>`;
    } else {
      return '</div>\n';
    }
  },
});

export default md;
