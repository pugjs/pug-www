import {toConstant} from 'constantinople';
import {Lexer} from 'pug-lexer';

import getCodeMirrorHTML from '../utils/get-codemirror-html.js';
import renderDoctypes from './doctypes.js';
import renderParams from './parameter-list.js';
import renderPreview from './preview.js';
import renderPreviewReadonly from './preview-readonly.js';

const parseInfo = (filename, info) => {
  const [lang = '', rest = ''] = info.split(/\s+(.+)/);
  const config = {};

  if (rest) {
    const lexer = new Lexer(rest, {filename});

    if (lexer.attrs()) {
      const attrs = lexer.tokens.slice(1, -1);
      attrs.forEach(({name, val}) => {
        config[name] = toConstant(val);
      });
    }
  }

  return {lang, config};
};

export default function mdItCodeBlock(md) {
  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const {lang, config} = parseInfo(env.filename, info);
    const str = token.content;

    let out;

    switch (lang) {
      case 'pug-preview':
        out = renderPreview({str, config, env});
        break;
      case 'pug-preview-readonly':
        out = renderPreviewReadonly({str, config, env});
        break;
      case 'parameter-list':
        out = renderParams({md, str, config});
        break;
      case 'doctypes':
        out = renderDoctypes();
        break;
      case '':
        out = `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
        break;
      default:
        out = `<pre class="cm-s-default"><code${slf.renderAttrs(token)}>${getCodeMirrorHTML(str, lang)}</code></pre>`;
        break;
    }

    return `${out}\n`;
  };
}
