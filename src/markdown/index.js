import {resolve} from 'path';
import {load as cheerioLoad} from 'cheerio';
import {PluginError, replaceExtension} from 'gulp-util';
import {compileFile} from '../../../pug';
import through from 'through2';

import md from './markdown-it.js';

const tmpl = p => resolve(__dirname, '..', '..', 'templates', p);

const compiledTemplates = {
  api: compileFile(tmpl('api.pug')),
  reference: compileFile(tmpl('reference.pug'))
};

export default function renderMd(lang) {
  return through.obj(function (file, encoding, callback) {
    if (file.isNull() || file.content === null) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new PluginError('md', 'Streams not supported!'));
    }

    try {
      let isReference = ~file.path.indexOf('reference');
      let rendered = md.render(file.contents.toString(), {
        filename: file.path,
        lang
      });

      const $ = cheerioLoad(rendered);
      let title = $('h1').first().text().trim();
      if (!title) {
        throw new Error(`h1 missing in ${file.path}`)
      }

      rendered = compiledTemplates[isReference ? 'reference' : 'api']({title, rawHtml: rendered});

      file.contents = Buffer.from ? Buffer.from(rendered) : new Buffer(rendered);
      file.path = replaceExtension(file.path, '.html');

      this.push(file);
    } catch (err) {
      return callback(new PluginError('md', err, {
        fileName: file.path,
        showStack: true
      }));
    }

    callback();
  });
};
