import React from 'react';

import getCodeMirrorHTML from '../../utils/get-codemirror-html.js';

export default props => {
  const positions = props.files.reduce((prev, {position}) => (prev.add(position), prev), new Set());
  const innerClass = ['col-lg-6', 'col-lg-4'][positions.size - 2];
  const index = {
    '<': 0,
    '>': positions.size === 2 ? 1 : 2,
    '|': 1
  };
  const columns = props.files.reduce((prev, cur) => {
    let col = prev[index[cur.position]];
    if (!col) {
      col = prev[index[cur.position]] = [];
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
        props.demo ? <div className="row">
          <div className="col-lg-12">
            Edit and render this sample live on <a href={`../demo.html#demo=${props.demo}`}>demo</a>.
          </div>
        </div> : null
      }
    </div>
  );
};
