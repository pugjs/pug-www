// import pug from '../external/pug';
import pug from '../../../pug';
import React from 'react';
import getCodeMirrorHTML from '../utils/get-codemirror-html.js'
import 'codemirror/mode/htmlmixed/htmlmixed';

export default class PugPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.initialCode,
      locals: {
        pageTitle: 'Pug'
      }
    };
  }

  render() {
    let compiled = pug.render(this.state.code, Object.assign({}, this.state.locals, {pretty: true}));
    const output = {
      __html: getCodeMirrorHTML(compiled, 'htmlmixed')
    };

    return (
      <div className="preview">
        <div>
          <pre className="preview-pug cm-s-default">
            <code>
              {this.state.code}
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
  }
}
