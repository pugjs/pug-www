import {html as beautifyHtml} from 'js-beautify';
import React from 'react';
import CodeMirror from 'react-code-mirror';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';

import pug from '../../external/pug';

export default class PugPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.initialCode.trim(),
      locals: {
        pageTitle: 'Pug'
      }
    };
    this.updateCode = this.updateCode.bind(this);
  }

  updateCode({target: {value}}) {
    this.setState({
      code: value
    });
  }

  render() {
    let output;
    try {
      const rendered = pug.render(this.state.code, Object.assign({}, this.state.locals));
      output = beautifyHtml(rendered);
    } catch (err) {
      output = err.message;
    }

    const options = {
      theme: 'default',
      viewportMargin: Infinity
    };

    return (
      <div className="row">
        <div className="col-lg-6" data-control="input-pug">
          <CodeMirror ref="input" value={this.state.code} onChange={this.updateCode} mode="jade" {...options} />
        </div>
        <div className="col-lg-6" data-control="output-html">
          <CodeMirror ref="output" value={output} mode="htmlmixed" readOnly {...options} />
        </div>
      </div>
    );
  }
}
