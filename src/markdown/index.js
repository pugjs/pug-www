import {basename, join, resolve} from 'path';
import {load as cheerioLoad} from 'cheerio';
import {PluginError, replaceExtension} from 'gulp-util';
import through from 'through2';
import File from 'vinyl';

import {compileFile} from '../../external/pug';
import md from './markdown-it.js';
import {previews} from './preview.js';

const tmpl = p => resolve(__dirname, '..', '..', 'templates', p);

const strToBuffer = str => Buffer.from ? Buffer.from(str) : new Buffer(str);

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
      const isReference = file.path.indexOf('reference') !== -1;
      let rendered = md.render(file.contents.toString(), {
        filename: file.path,
        lang
      });

      const $ = cheerioLoad(rendered);
      const title = $('h1').first().text().trim();
      if (!title) {
        throw new Error(`h1 missing in ${file.path}`);
      }
      const demos = previews[basename(file.path, '.md')] || [];

      rendered = compiledTemplates[isReference ? 'reference' : 'api']({
        title,
        rawHtml: rendered,
        demos
      });

      if (isReference) {
        this.push(new File({
          path: join('demos', basename(file.path, '.md') + '.json'),
          contents: strToBuffer(JSON.stringify(demos))
        }));
      }

      file.contents = strToBuffer(rendered);
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
}
