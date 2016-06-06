import getCodeMirrorHTML from '../utils/get-codemirror-html.js';
import renderDoctypes from './doctypes.js';
import renderParams from './parameter-list.js';
import renderPreview from './preview.js';

export default function mdItCodeBlock(md) {
  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    let lang = '';
    let config = [];
    const str = token.content;

    if (info) {
      const splitted = info.split(/\s+/g);
      lang = splitted[0];
      config = splitted.slice(1);
      token.attrJoin('class', options.langPrefix + lang);
    }

    if (lang.indexOf('pug-preview') === 0) {
      return `${renderPreview({str, lang, config, env})}\n`;
    }

    if (lang.indexOf('parameter-list') === 0) {
      return `${renderParams({md, str, lang})}\n`;
    }

    if (lang === 'doctypes') {
      return `${renderDoctypes()}\n`;
    }

    if (lang) {
      const highlighted = getCodeMirrorHTML(str, lang);
      return `<pre class="cm-s-default"><code${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`;
    }

    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>\n`;
  };
}
