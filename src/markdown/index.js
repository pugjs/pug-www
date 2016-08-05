import {dirname, relative, resolve} from 'path';
import fm from 'front-matter';
import {renderFile} from 'pug';

import md from './markdown-it.js';
import {previews} from './preview.js';

const tmpl = p => resolve(__dirname, '..', '..', 'templates', `${p}.pug`);

export default function renderMd(lang, src) {
  const {attributes, body} = fm(src);
  const {template, id} = attributes;

  let rendered = md.render(body, {
    lang,
    id
  });

  const demos = previews[id] || [];

  rendered = renderFile(tmpl(template), Object.assign({
    lang,
    rawHtml: rendered,
    demos,
    dirname,
    relative,
    _: require(`../../../pug-${lang}/strings.json`)
  }, attributes));

  return rendered;
}
