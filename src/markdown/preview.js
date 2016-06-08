import {basename, extname} from 'path';
import React from 'react';
import {renderToString} from 'react-dom/server';

import PugPreview from '../components/pug-preview.js';
import PugPreviewReadonly from '../components/pug-preview-readonly.js';
import {getMode} from '../utils/get-codemirror-html.js';

export const demos = [];
export const previews = {};

export default function renderPreview({str, lang, config, env}) {
  if (lang === 'pug-preview') {
    const splitted = str.split(/\\{10}/);
    const files = [];

    if (splitted.length === 1) {
      files.push({
        name: 'index.pug',
        mode: getMode('pug'),
        contents: str.trim()
      });
    } else {
      splitted.slice(1).forEach(cur => {
        const lines = cur.split('\n');
        const header = lines[0].trim().split(/\s+/);

        files.push({
          name: header[0],
          mode: getMode(extname(header[0]).substr(1)),
          contents: lines.slice(1).join('\n').trim()
        });
      });
    }

    if (!previews[basename(env.filename, '.md')]) {
      previews[basename(env.filename, '.md')] = [];
    }
    const i = previews[basename(env.filename, '.md')].push(files) - 1;

    return `<div class="preview-wrapper" data-control="interactive" data-index=${i}>${
      renderToString(<PugPreview {...{files}} />)
    }</div>`;
  } else if (lang === 'pug-preview-readonly') {
    const files = str.split(/\\{10}/).slice(1).reduce((prev, cur) => {
      const lines = cur.split('\n');
      const header = lines[0].trim().split(/\s+/);

      prev.push({
        name: header[0],
        mode: getMode(extname(header[0]).substr(1)),
        input: basename(header[0], extname(header[0])) !== 'output',
        position: header[1],
        contents: `${lines.slice(1).join('\n').trim()}\n`
      });
      return prev;
    }, []);

    config = config.reduce((prev, cur) => (prev[cur.split('=')[0]] = cur.substr(cur.indexOf('=') + 1), prev), {});
    config.files = files;

    if (config.demo) {
      demos.push(config);
    }

    return renderToString(<PugPreviewReadonly {...{config, env}} />);
  }
}
