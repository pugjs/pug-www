import {resolve, dirname, relative} from 'path';

import {html_beautify as beautifyHtml} from 'js-beautify/js/lib/beautify-html.js';
import objectAssign from 'object-assign';
import pug from 'pug';
import React from 'react';
import CodeMirror from '@timothygu/react-code-mirror';

import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/pug/pug';

import detect from '../feature-detect/index.js';

export default class PugPreview extends React.Component {
  constructor(props) {
    super(props);

    const {files, main, features} = props;
    this.state = {
      files,
      main
    };

    this._inputs = [];
    this._supported = detect(features);

    this.findFile = filename => {
      for (let i = 0; i < this.state.files.length; i++) {
        if (this.state.files[i].name === filename) {
          return this.state.files[i];
        }
      }
      return null;
    };

    this.genUpdateFunc = i => ({target: {value}}) => {
      const {files} = this.state;
      files[i].contents = value;
      this.setState({files});
    };

    this.options = {
      plugins: [
        {
          name: 'pug-www',
          resolve: (filename, source) => resolve(dirname(source.trim()), filename.trim()),
          read: filename => {
            const resolved = resolve(filename);
            const prop = relative(process.cwd(), resolved);

            if (!this.findFile(prop)) {
              throw objectAssign(new Error(`ENOENT: no such file or directory, open ${resolved}`), {
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

  static get propTypes() {
    return {
      files: React.PropTypes.array.isRequired,
      main: React.PropTypes.string,
      features: React.PropTypes.array,
      output: React.PropTypes.string
    };
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production' && !this._supported) {
      this._inputs.forEach(({editor}) => {
        editor.on('keypress', () => {
          // TODO: tell the user their browser is too old
        });
      });
    }
  }

  static get defaultProps() {
    return {
      main: 'index.pug',
      features: []
    };
  }

  render() {
    let output;

    if (this._supported) {
      try {
        output = pug.render(this.findFile(this.state.main).contents, objectAssign({
          filename: this.state.main
        }, this.options)).trim();
        output = beautifyHtml(output, {indent_size: 2});
      } catch (err) {
        output = err.message;
      }
    } else {
      output = this.props.output;
    }

    const options = {
      theme: 'default',
      viewportMargin: Infinity,
      indentUnit: 2,
      indentWithTabs: false,
      tabSize: 2,
      extraKeys: {
        Tab: cm => {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          cm.replaceSelection(spaces);
        }
      }
    };

    // HACK
    if (this.props.renderOnly) {
      return <pre dangerouslySetInnerHTML={{__html: output}}/>;
    }

    return (
      <div className="row">
        <div className="col-lg-6">
        {
          this.state.files.map((file, i) => (
            <CodeMirror ref={c => this._inputs.push(c)} key={file.name} value={file.contents} onChange={this.genUpdateFunc(i)} mode={file.mode} readOnly={file.readOnly || !this._supported} {...options}/>
          ))
        }
        </div>
        <div className="col-lg-6">
          <CodeMirror value={output} mode="htmlmixed" readOnly={true} {...options}/>
        </div>
      </div>
    );
  }
}
