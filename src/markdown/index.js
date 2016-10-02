import MarkdownIt from 'markdown-it';
import mdItAnchor from 'markdown-it-anchor';
import mdItContainer from 'markdown-it-container';

import mdItCodeBlock from './code-block.js';

export const md = new MarkdownIt({
  html: true,
  typographer: true
});

const defaultSlugify = mdItAnchor.defaults.slugify;
md.use(mdItAnchor, {
  level: 2,
  slugify: string => {
    const tail = /~~(.+)$/.exec(string);
    return defaultSlugify(tail ? tail[1] : string);
  },
  permalink: true
});

md.use((md, syntax) => {
  md.core.ruler.push('heading_comments', ({tokens}) => {
    for (let token of tokens.filter(token => token.type === 'heading_open')) {
      const title = tokens[tokens.indexOf(token) + 1].children[0];
      title.content = title.content.replace(syntax, '').trim();
    }
  });
}, /~~(.+)$/);

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
