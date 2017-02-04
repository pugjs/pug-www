import React from 'react';

function getParams(md, str) {
  return str.trim().split('\n').reduce((params, curLine, i) => {
    curLine = curLine.trim();

    if (i % 3 === 0) {
      params.push({name: curLine});
    } else {
      const param = params[params.length - 1];
      curLine = curLine.substr(1).trim();

      if (i % 3 === 1) {
        param.type = curLine;
      } else {
        // TODO: Figure out how to render bits of markdown inline?
        param.description = curLine; // md.renderInline(curLine);
      }
    }

    return params;
  }, []);
}

function ParameterList(props) {
  console.dir(props.children);
  const params = getParams(null, props.children.join('\n'));
  return pug`
    dl.parameter-list
      each param in params
        dt(key=param.name) #{param.name}#[span.type : #{param.type}]
        dd.description= param.description
  `;
}

export default ParameterList;
