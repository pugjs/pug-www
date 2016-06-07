import React from 'react';
import ReactCodeMirror from 'react-codemirror';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';

import pug from '../../../external/pug';

export default class PugPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.initialCode,
      locals: {
        pageTitle: 'Pug'
      }
    };

    this.updateCode = this.updateCode.bind(this);
  }

  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  }

  render() {
    const compiled = pug.render(this.state.code, Object.assign({}, this.state.locals, {pretty: true}));

    return (
      <div className="row">
        <div className="col-lg-6">
          <ReactCodeMirror data-control="input-pug" value={this.state.code} onChange={this.updateCode} options={{
        mode: 'jade'
          }} />
        </div>
        <div className="col-lg-6">
          <ReactCodeMirror data-control="output-html" value={compiled} options={{
            mode: 'htmlmixed',
            readOnly: true
          }} />
        </div>
      </div>
    );
  }
}
