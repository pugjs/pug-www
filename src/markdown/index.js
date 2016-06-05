import {html as beautifyHTML} from 'js-beautify';
import MarkdownIt from 'markdown-it';
import {render as pugRender} from 'pug';

import mdItAnchor from 'markdown-it-anchor';
import mdItContainer from 'markdown-it-container';

import PugPreview from '../components/PugPreviewServer.js';
import renderComponent from '../utils/render-component.js';

import renderParams from './parameter-list.js';

const md = MarkdownIt({
  html: true,
  typographer: true
});

md.use(mdItAnchor);

md.use(function mdItCodeBlock(md, name, options) {
  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    let token = tokens[idx];
    let info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    let lang = '';
    let str = token.content;

    if (info) {
      lang = info.split(/\s+/g)[0];
      token.attrJoin('class', options.langPrefix + lang);
    }

    if (lang.indexOf('pug-demo') === 0) {
      return renderComponent(PugPreview, {
        initialCode: str
      }) + '\n';
    } else if (lang.indexOf('parameter-list') === 0) {
      return renderParams({md, str, lang}) + '\n';
    } else {
      return `<pre><code${slf.renderAttrs(token)}>${md.utils.escapeHtml(str)}</code></pre>\n`;
    }
  };
});

md.use(mdItContainer, 'panel', {
  validate(params) {
    return /^panel\s+([^\s]*)\s+(.*)$/.test(params.trim());
  },
  render(tokens, idx) {
    let tok = tokens[idx];
    let m = tok.info.trim().match(/^panel\s+([^\s]*)\s+(.*)$/);

    if (tok.nesting === 1) {
      let className = md.utils.escapeHtml(m[1]);
      let title = md.utils.escapeHtml(m[2]);

      return (
`<div class="panel panel-${className}">
<div class="panel-heading">${title}</div>
<div class="panel-body">
`);
    } else {
      return '  </div>\n</div>\n';
    }
  },
});

export default md;
