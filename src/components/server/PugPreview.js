// import pug from '../external/pug';
import pug from '../../../../pug';
import React from 'react';
import getCodeMirrorHTML from '../../utils/get-codemirror-html.js'
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';

export default (props) => {
  let compiled = pug.render(props.initialCode, {pretty: true});
  const input = {
    __html: getCodeMirrorHTML(props.initialCode, 'jade').trim()
  };
  const output = {
    __html: getCodeMirrorHTML(compiled, 'htmlmixed').trim()
  };

  return (
    <div className="row" data-control="interactive">
      <div className="col-lg-6">
        <pre className="cm-s-default" data-control="input-pug">
          <code dangerouslySetInnerHTML={input}>
          </code>
        </pre>
      </div>
      <div className="col-lg-6">
        <pre className="cm-s-default" data-control="output-html">
          <code dangerouslySetInnerHTML={output}>
          </code>
        </pre>
      </div>
    </div>
  );
};
