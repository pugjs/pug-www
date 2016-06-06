import {writeFileSync as write} from 'fs';
import {basename, extname, resolve} from 'path';
import {sync as mkdirp} from 'mkdirp';

import PugPreview from '../components/server/PugPreview.js';
import PugPreviewReadOnly from '../components/server/PugPreviewReadOnly.js';
import renderComponent from '../utils/render-component.js';

export const demos = [];

export default function renderPreview({str, lang, config, env}) {
  if (lang === 'pug-preview') {
    return renderComponent(PugPreview, {
      initialCode: str,
      config
    });
  } else if (lang === 'pug-preview-readonly') {
    let files = str.split(/\\{10}/).slice(1).reduce((prev, cur) => {
      let lines = cur.split('\n');
      let header = lines[0].trim().split(/\s+/);

      prev.push({
        name: header[0],
        mode: extname(header[0]).substr(1),
        input: basename(header[0], extname(header[0])) !== 'output',
        position: header[1],
        contents: lines.slice(1).join('\n').trim() + '\n'
      });
      return prev;
    }, []);

    config = config.reduce((prev, cur) => (prev[cur.split('=')[0]] = cur.substr(cur.indexOf('=') + 1), prev), {});
    config.files = files;

    if (config.demo) {
      demos.push(config);
    }

    return renderComponent(PugPreviewReadOnly, config);
  }
};
