import {extname} from 'path';

import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';

import PugPreview from '../components/pug-preview.js';
import {getMode} from '../utils/get-codemirror-html.js';

export const previews = {};

export default function renderPreview({str, config = {}, env: {lang, id}}) {
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
      const [header, ...lines] = cur.split('\n');
      const [name] = header.trim().split(/\s+/);
      const ext = extname(name);

      files.push({
        name,
        mode: getMode(ext.substr(1)),
        contents: lines.join('\n').trim()
      });
    });
  }

  config.files = files;

  const key = `${lang}-${id}`
  if (!previews[key]) {
    previews[key] = [];
  }
  const i = previews[key].push(config) - 1;

  if (config.features) {
    const rendered = renderToStaticMarkup(<PugPreview renderOnly {...config}/>);
    config.output = rendered.substring('<pre>'.length, rendered.length - '</pre>'.length);
  }

  return `<div class="preview-wrapper" data-control="interactive" data-index=${i}>${
    renderToString(<PugPreview {...config}/>)
  }</div>`;
}
