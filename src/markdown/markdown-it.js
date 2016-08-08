import MarkdownIt from 'markdown-it';
import mdItAnchor from 'markdown-it-anchor';
import mdItContainer from 'markdown-it-container';

import mdItCodeBlock from './code-block.js';

const md = new MarkdownIt({
  html: true,
  typographer: true
});

md.use(mdItAnchor, {
  level: 2,
  permalink: true
});

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

export default md;
