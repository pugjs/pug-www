// import pug from '../external/pug';
import pug from '../../../pug';
import React from 'react';
import ReactCodeMirror from 'react-codemirror';
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

  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  }

  render() {
    let compiled = pug.render(this.state.code, Object.assign({}, this.state.locals, {pretty: true}));

    return (
      <div class="preview">
        <ReactCodeMirror class="preview-pug" value={this.state.code} onChange={this.updateCode} options={{}} />
        <ReactCodeMirror class="preview-html" value={compiled} options={{
          mode: 'htmlmixed',
          readOnly: true
        }} />
      </div>
    );
  }
}
