import {basename, extname} from 'path';

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import PugPreviewReadonly from '../components/pug-preview-readonly.js';
import {getMode} from '../utils/get-codemirror-html.js';

export default function renderPreviewReadonly({str, config = {}, env}) {
  const files = str.split(/\\{10}/).slice(1).reduce((prev, cur) => {
    const [header, ...lines] = cur.split('\n');
    const [name, position] = header.trim().split(/\s+/);
    const ext = extname(name);

    prev.push({
      name,
      mode: getMode(ext.substr(1)),
      input: basename(name, ext) !== 'output',
      position,
      contents: `${lines.join('\n').trim()}\n`
    });
    return prev;
  }, []);

  config.files = files;

  return renderToStaticMarkup(<PugPreviewReadonly {...{config, env}}/>);
}
