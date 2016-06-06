import {basename, extname} from 'path';

import PugPreview from '../components/server/pug-preview.js';
import PugPreviewReadonly from '../components/server/pug-preview-readonly.js';
import renderComponent from '../utils/render-component.js';

export const demos = [];

export default function renderPreview({str, lang, config}) {
  if (lang === 'pug-preview') {
    return renderComponent(PugPreview, {
      initialCode: str,
      config
    });
  } else if (lang === 'pug-preview-readonly') {
    const files = str.split(/\\{10}/).slice(1).reduce((prev, cur) => {
      const lines = cur.split('\n');
      const header = lines[0].trim().split(/\s+/);

      prev.push({
        name: header[0],
        mode: extname(header[0]).substr(1),
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

    return renderComponent(PugPreviewReadonly, config);
  }
}
