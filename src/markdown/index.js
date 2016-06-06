import {join, resolve} from 'path';
import {load as cheerioLoad} from 'cheerio';
import {PluginError, replaceExtension} from 'gulp-util';
import {compileFile} from '../../../pug';
import through from 'through2';
import File from 'vinyl';

import md from './markdown-it.js';
import {demos} from './preview.js';

const tmpl = p => resolve(__dirname, '..', '..', 'templates', p);

const compiledTemplates = {
  api: compileFile(tmpl('api.pug')),
  reference: compileFile(tmpl('reference.pug'))
};

export function renderMd(lang) {
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
};

export function getDemoFiles() {
  const stream = through.obj();

  setImmediate(() => {
    let manifest = {};

    demos.forEach(demo => {
      const inputs = demo.files.filter(f => f.input);

      inputs.forEach(file => {
        stream.write(new File({
          path: resolve('demos', demo.demo, file.name),
          contents: strToBuffer(file.contents)
        }));
      });

      manifest[demo.demo] = {
        files: inputs.map(file => file.name)
      };
    });

    stream.write(new File({
      path: resolve('demos', 'manifest.json'),
      contents: strToBuffer(JSON.stringify(manifest))
    }));

    stream.end();
  });

  return stream;
};

const strToBuffer = str => Buffer.from ? Buffer.from(str) : new Buffer(str);
