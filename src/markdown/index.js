import {basename, join, resolve} from 'path';
import {load as cheerioLoad} from 'cheerio';
import {PluginError, replaceExtension} from 'gulp-util';
import through from 'through2';
import File from 'vinyl';

import {compileFile} from 'pug';
import md from './markdown-it.js';
import {previews} from './preview.js';

const tmpl = p => resolve(__dirname, '..', '..', 'templates', p);

const strToBuffer = str => Buffer.from ? Buffer.from(str) : new Buffer(str);

const compiledTemplates = {
  api: compileFile(tmpl('api.pug')),
  reference: compileFile(tmpl('reference.pug'))
};

export default function renderMd(lang, src, filename, options) {
  const isReference = filename.indexOf('reference') !== -1;
  let rendered = md.render(src, {
    filename,
    lang
  });

  const $ = cheerioLoad(rendered);
  const title = $('h1').first().text().trim();
  if (!title) {
    throw new Error(`h1 missing in ${filename}`);
  }
  const demos = previews[basename(filename, '.md')] || [];

  rendered = compiledTemplates[isReference ? 'reference' : 'api']({
    title,
    rawHtml: rendered,
    demos
  });

  if (options && options.getDemos) {
    return demos;
  }
  return rendered;
}
