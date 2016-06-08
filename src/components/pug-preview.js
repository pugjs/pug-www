import {resolve, dirname, relative} from 'path';
import {html_beautify as beautifyHtml} from 'js-beautify/js/lib/beautify-html.js';
import React from 'react';
import CodeMirror from 'react-code-mirror';

import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jade/jade';
import 'codemirror/mode/javascript/javascript';

import pug from '../../external/pug';

export default class PugPreview extends React.Component {
  constructor(props) {
    super(props);

    const {files, main} = props;
    this.state = {
      files,
      main: main || 'index.pug'
    };

    this.findFile = filename => {
      for (let i = 0; i < this.state.files.length; i++) {
        if (this.state.files[i].name === filename) {
          return this.state.files[i];
        }
      }
      return null;
    };

    this.updateCode = (i, {target: {value}}) => {
      this.state.files[i].contents = value;
      this.setState({files: this.state.files});
    };

    this.options = {
      plugins: [
        {
          name: 'pug-www',
          resolve: (filename, options) => {
            const source = options.filename.trim();
            return resolve(dirname(source), filename.trim());
          },
          read: filename => {
            const resolved = resolve(filename);
            const prop = relative(process.cwd(), resolved).replace(/\\/g, '/');

            if (!this.findFile(prop)) {
              throw Object.assign(new Error('ENOENT: no such file or directory, open ' + prop), {
                errno: -4058,
                code: 'ENOENT',
                syscall: 'open',
                path: resolved
              });
            }

            return this.findFile(prop).contents;
          }
        }
      ]
    };
  }

  render() {
    let output;

    try {
      output = pug.render(this.findFile(this.state.main).contents, Object.assign({
        filename: this.state.main
      }, this.options));
      output = beautifyHtml(output);
    } catch (err) {
      output = err.message;
    }

    const options = {
      theme: 'default',
      viewportMargin: Infinity,
      indentUnit: 2,
      indentWithTabs: false,
      tabSize: 2
    };

    return (
      <div className="row">
        <div className="col-lg-6">
        {
          this.state.files.map((file, i) => (
            <CodeMirror key={file.name} value={file.contents} onChange={this.updateCode.bind(this, i)} mode={file.mode} readOnly={file.readOnly} {...options} />
          ))
        }
        </div>
        <div className="col-lg-6">
          <CodeMirror value={output} mode="htmlmixed" readOnly {...options} />
        </div>
      </div>
    );
  }
}
