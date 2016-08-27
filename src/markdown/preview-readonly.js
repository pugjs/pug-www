import assert from 'assert';
import {extname} from 'path';

import {compile} from 'pug';

import getCodeMirrorHTML from '../utils/get-codemirror-html.js';

const tmpl = compile(`
div
  .row
    each col in columns
      div(class=\`col-lg-\${12 / positions}\`)
        each file in col
          pre.cm-s-default
            code!= file
`);

export default ({str, config, env: {filename}}) => {
  const positions = new Set();

  const files = str.split(/\\{10}/).slice(1).reduce((prev, cur) => {
    const [header, ...lines] = cur.split('\n');
    const [name, position] = header.trim().split(/\s+/);
    const ext = extname(name);

    assert(/[<>|]/.test(position), `Unknown position "${position}" in ${filename}`);
    positions.add(position);

    prev.push({
      contents: getCodeMirrorHTML(lines.join('\n').trim(), ext.substr(1)).trim(),
      position
    });
    return prev;
  }, []);

  const index = {
    '<': 0,
    '>': positions.size === 2 ? 1 : 2,
    '|': 1
  };
  const columns = files.reduce((prev, {contents, position}) => {
    const i = index[position];
    (prev[i] = prev[i] || []).push(contents);
    return prev;
  }, []);

  return tmpl({
    columns,
    positions: positions.size
  });
}
