import React from 'react';

import getCodeMirrorHTML from '../utils/get-codemirror-html.js';

export default ({config: {files, demo}, env: {filename}}) => {
  const positions = files.reduce((prev, {position}) => (prev.add(position), prev), new Set());
  const innerClass = ['col-lg-6', 'col-lg-4'][positions.size - 2];

  if (!innerClass) {
    throw new Error(`Too many positions of pug-preview-readonly ${positions.size} in ${filename}`);
  }

  const index = {
    '<': 0,
    '>': positions.size === 2 ? 1 : 2,
    '|': 1
  };
  const columns = files.reduce((prev, cur) => {
    const i = index[cur.position];
    if (i === undefined) {
      throw new Error(`Unknown position "${cur.position}" in ${filename}`);
    }

    let col = prev[i];
    if (!col) {
      col = prev[i] = [];
    }
    col.push(cur);

    return prev;
  }, []);

  return (
    <div>
      <div className="row">
        {columns.map(col => (
          <div className={innerClass}>
            {col.map(file => (
              <pre className={`preview-${file.mode} cm-s-default`}>
                <code dangerouslySetInnerHTML={{
                  __html: getCodeMirrorHTML(file.contents, file.mode).trim()
                }}></code>
              </pre>
            ))}
          </div>
        ))}
      </div>
      {
        demo ? <div className="row">
          <div className="col-lg-12">
            Edit and render this sample live on <a href={`../demo.html#demo=${demo}`}>demo</a>.
          </div>
        </div> : null
      }
    </div>
  );
};
