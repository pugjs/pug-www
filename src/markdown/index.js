import {readFileAsync} from 'fs-extra-promise';
import {dirname, relative} from 'path';

import fm from 'front-matter';
import {renderFile} from 'pug';

import {md, tmpl} from '../utils/paths.js';
import markdown from './markdown-it.js';
import {previews} from './preview.js';

export default async (lang, path) => {
  const src = await readFileAsync(md(lang, path), 'utf8');
  const {attributes, body} = fm(src);
  const {template, id} = attributes;

  let rendered = markdown.render(body, {
    lang,
    id
  });

  const demos = previews[id] || [];

  return renderFile(tmpl(template), Object.assign({
    lang,
    rawHtml: rendered,
    demos,
    dirname,
    relative,
    _: require(`../../../pug-${lang}/strings.json`)
  }, attributes));
};
