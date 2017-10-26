import {readFileSync} from 'fs';
import {dirname, relative} from 'path';

import fm from 'front-matter';
import jsStringify from 'js-stringify';
import {compileFile as pug} from 'pug';

import markdown from '../markdown/index';
import {md, tmpl, strs} from '../utils/paths';

export class Page {
  constructor(lang, path) {
    const filename = md(lang, path);
    const src = readFileSync(filename).toString();
    const {attributes, body} = fm(src);

    Object.assign(this, {
      lang,
      path,
      filename,
      src,
      attributes,
      body,
      bodyLine: src.split('\n').length - body.split('\n').length,
      _: require(strs(lang))
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
