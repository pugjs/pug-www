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
  render(tokens, idx, options, env) {
    const tok = tokens[idx];
    const m = tok.info.trim().match(/^float\s+(.*)$/);

    if (tok.nesting === 1) {
      const info = {
        danger: {className: 'danger', title: 'Danger'},
        warning: {className: 'warning', title: 'Warning'},
        note: {className: 'info', title: 'Note'}
      }[m[1].trim()];

      if (!info) {
        throw new Error(`Float level "${m[1].trim()}" not defined. Used in ${env.id}.`);
      }

      const {className, title} = info;
      return `<div class="alert alert-${className}"><p><strong>${title}</strong></p>`;
    }

    return '</div>\n';
  }
});

export default md;
