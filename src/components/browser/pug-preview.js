import React from 'react';
import ReactCodeMirror from 'react-codemirror';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';

import pug from '../../../pug';

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

  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  }

  render() {
    const compiled = pug.render(this.state.code, Object.assign({}, this.state.locals, {pretty: true}));

    return (
      <div class="preview">
        <ReactCodeMirror class="preview-pug" value={this.state.code} onChange={this.updateCode} options={{
          mode: 'jade'
        }} />
        <ReactCodeMirror class="preview-html" value={compiled} options={{
          mode: 'htmlmixed',
          readOnly: true
        }} />
      </div>
    );
  }
}
