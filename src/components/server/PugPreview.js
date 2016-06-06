// import pug from '../external/pug';
import pug from '../../../../pug';
import React from 'react';
import getCodeMirrorHTML from '../../utils/get-codemirror-html.js'
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';

export default (props) => {
  let compiled = pug.render(props.initialCode, {pretty: true});
  const input = {
    __html: getCodeMirrorHTML(props.initialCode, 'jade')
  };
  const output = {
    __html: getCodeMirrorHTML(compiled, 'htmlmixed')
  };

  return (
    <div className="preview" data-control="interactive">
      <div>
        <pre className="preview-pug cm-s-default">
          <code dangerouslySetInnerHTML={input}>
          </code>
        </pre>
      </div>
      <div>
        <pre className="preview-html cm-s-default">
          <code dangerouslySetInnerHTML={output}>
          </code>
        </pre>
      </div>
    </div>
  );
};
