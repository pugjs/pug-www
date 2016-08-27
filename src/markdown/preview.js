import {extname} from 'path';

import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';

// The order is important. get-codemirror-html loads the node version of
// CodeMirror, which caches itself so that `import 'codemirror'` will not
// `require` the browser version.
import {getMode} from '../utils/get-codemirror-html.js';
import PugPreview from '../components/pug-preview.js';

export const previews = {};

export default ({str, config, env: {filename}}) => {
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
      const [header, lines] = cur.split(/\n(.+)/);
      const [name] = header.trim().split(/\s/);
      const ext = extname(name);

      files.push({
        name,
        mode: getMode(ext.substr(1)),
        contents: lines.trim()
      });
    });
  }

  config.files = files;

  if (!previews[filename]) {
    previews[filename] = [];
  }
  const i = previews[filename].push(config) - 1;

  if (config.features) {
    const rendered = renderToStaticMarkup(<PugPreview renderOnly {...config}/>);
    config.output = rendered.substring('<pre>'.length, rendered.length - '</pre>'.length);
  }

  return `<div class="preview-wrapper" data-control="interactive" data-index=${i}>${
    renderToString(<PugPreview {...config}/>)
  }</div>`;
}
