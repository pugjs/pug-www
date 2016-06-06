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
  permalink: true,
  permalinkClass: 'small'
});

md.use(mdItCodeBlock);

md.use(mdItContainer, 'card', {
  validate(params) {
    return /^float\s+(.*)$/.test(params.trim());
  },
  render(tokens, idx) {
    const tok = tokens[idx];
    const m = tok.info.trim().match(/^float\s+(.*)$/);

    if (tok.nesting === 1) {
      const className = {
        danger: 'danger',
        note: 'info'
      }[m[1].trim()];
      const title = {
        danger: 'Danger',
        note: 'Note'
      }[m[1].trim()];

      return `<div class="alert alert-${className}"><p><strong>${title}</strong></p>`;
    }

    return '</div>\n';
  }
});

export default md;
