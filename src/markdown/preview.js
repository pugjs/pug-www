import {writeFileSync as write} from 'fs';
import {basename, extname, resolve} from 'path';
import {sync as mkdirp} from 'mkdirp';

import PugPreview from '../components/server/PugPreview.js';
import PugPreviewAdvanced from '../components/server/PugPreviewAdvanced.js';
import renderComponent from '../utils/render-component.js';

const slugIdx = {};

const getSlug = filename => {
  filename = basename(filename, extname(filename));
  if (filename in slugIdx) {
    return [filename, ++slugIdx[filename]].join('-');
  } else {
    return [filename, slugIdx[filename] = 0].join('-');
  }
};

export const demos = [];

export default ({str, lang, config, env}) => {
  if (lang === 'pug-preview') {
    return renderComponent(PugPreview, {
      initialCode: str,
      config
    });
  } else if (lang === 'pug-preview-advanced') {
    let files = str.split(/\\{10}/).slice(1).reduce((prev, cur) => {
      let lines = cur.split('\n');
      let header = lines[0].trim().split(/\s+/);

      prev.push({
        name: header[0],
        mode: extname(header[0]).substr(1),
        position: header[1],
        contents: lines.slice(1).join('\n').trim() + '\n'
      });
      return prev;
    }, []);

    config = config.reduce((prev, cur) => (prev[cur] = true, prev), {});
    config.files = files;

    if (config.fs) {
      config.slug = getSlug(env.filename);
      demos.push(config);
    }

    return renderComponent(PugPreviewAdvanced, config);
  }
};
