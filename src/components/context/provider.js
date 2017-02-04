import React, {Component, PropTypes} from 'react';
import contextProperties from './context-shape';

class Provider extends Component {
  static propTypes = contextProperties;
  static childContextTypes = {
    wwwContext: PropTypes.shape(contextProperties).isRequired,
  }

  getChildContext() {
    return {
      wwwContext: {
        attributes: this.props.attributes,
        defaultLang: this.props.defaultLang,
        lang: this.props.lang,
        path: this.props.path,
        strings: this.props.strings,
      },
    };
  }

  render() {
    return this.props.children;
  }
}

export default Provider;
