import {toConstant} from 'constantinople';
import {Lexer} from 'pug-lexer';

import getCodeMirrorHTML from '../utils/get-codemirror-html.js';
import renderDoctypes from './doctypes.js';
import renderParams from './parameter-list.js';
import renderPreview from './preview.js';

export default function mdItCodeBlock(md) {
  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    let lang = '';
    const config = {};
    const str = token.content;

    if (info) {
      const splitted = info.split(/\s+/g);
      lang = splitted[0];
      const lexer = new Lexer(splitted.slice(1).join(' '), {});
      let res;
      try {
        res = lexer.attrs();
      } catch (err) {
        err.message += `\nIn ${env.id}`;
        throw err;
      }

      if (res) {
        const attrs = lexer.tokens.slice(1, -1);
        attrs.forEach(({name, val}) => {
          config[name] = toConstant(val);
        });
      }
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
