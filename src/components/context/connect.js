import React, {Component, PropTypes} from 'react';
import contextProperties from './context-shape';

function connect(Presenter) {
  class Connector extends Component {
    static contextTypes = {
      wwwContext: PropTypes.shape(contextProperties).isRequired,
    }
    getUrl = url => {
      const context = this.context.wwwContext;
      if (context.lang === defaultLang) {
        return url;
      } else {
        return '/' + context.lang + url;
      }
    };
    render() {
      const context = this.context.wwwContext;
      return pug`
        Presenter(
          ...this.props
          attributes=context.attributes
          defaultLang=context.defaultLang
          lang=context.lang
          path=context.path
          strings=context.strings
          getUrl=context.getUrl
        )
      `;
    }
  }

export default Provider;
