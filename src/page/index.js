import {readFileSync} from 'fs';
import {dirname, relative} from 'path';

import fm from 'front-matter';
import jsStringify from 'js-stringify';
import {compileFile as pug} from 'pug';

import markdown from '../markdown/index';
import {md, tmpl, strs} from '../utils/paths';

function deepMerge(a, b) {
  const result = {};
  for (const key of Object.keys(a)) {
    if (!(key in b)) {
      result[key] = a[key];
    }
  }
  for (const key of Object.keys(b)) {
    if (
      b[key] && typeof b[key] === 'object' && !Array.isArray(b[key]) &&
      a[key] && typeof a[key] === 'object' && !Array.isArray(a[key])
    ) {
      result[key] = deepMerge(a[key], b[key]);
    } else {
      result[key] = b[key];
    }
  }
  return result;
}
export class Page {
  constructor(lang, path) {
    const filename = md(lang, path);
    let src;
    try {
      src = readFileSync(filename).toString();
    } catch (ex) {
      const filename = md('en', path);
      src = readFileSync(filename).toString();
    }
    const {attributes, body} = fm(src);

    Object.assign(this, {
      lang,
      path,
      filename,
      src,
      attributes,
      body,
      bodyLine: src.split('\n').length - body.split('\n').length,
      _: lang === 'en' ? require(strs('en')) : deepMerge(require(strs('en')), require(strs(lang))),
    });
  }

  render() {
    this.demos = [];
    const rawHtml = markdown(this.body, this);
    return pug(tmpl(this.attributes.template))(Object.assign({
      dirname,
      relative,
      jsStringify,
      rawHtml,
      id: this.attributes.id
    }, this));
  }
}

export default (lang, path) => new Page(lang, path).render();
