import MarkdownIt from 'markdown-it';
import mdItAnchor from 'markdown-it-anchor';
import mdItContainer from 'markdown-it-container';

import mdItCodeBlock from './code-block.js';

export const md = new MarkdownIt({
  html: true,
  typographer: true
});

const slugifyLegacy = mdItAnchor.defaults.slugify;
const slugifySpecified = string => {
  const tail = string.match(/~~(.+)$/);
  if (tail) {
    return slugifyLegacy(tail[1]);
  } else {
    return slugifyLegacy(string);
  }
};

md.use(mdItAnchor, {
  level: 2,
  slugify: slugifySpecified,
  permalink: true
});

md.use((md, syntax) => md.core.ruler.push('heading_comments', state => {
  const tokens = state.tokens;
  tokens
    .filter(token => token.type === 'heading_open')
    .forEach(token => {
      const title = tokens[tokens.indexOf(token) + 1].children[0];
      title.content = title.content.replace(syntax, '').trim();
    });
}), /~~(.+)$/);

md.use(mdItCodeBlock);

md.use(mdItContainer, 'card', {
  validate(params) {
    return /^float\s+(.*)$/.test(params.trim());
  },
  render(tokens, idx) {
    const tok = tokens[idx];
    const m = tok.info.trim().match(/^float\s+([^ ]*)(.*)$/);

    if (tok.nesting === 1) {
      return `<div class="alert alert-${m[1]}"><h6>${m[2]}</h6>`;
    }

    return '</div>\n';
  }
});

export default md.render.bind(md);
