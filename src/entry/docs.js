import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PugPreview from '../components/pug-preview.js';

import '../../scss/docs.scss';

window.ReactDOM = ReactDOM;
window.React = React;
window.PugPreview = PugPreview;

[].slice.call(document.querySelectorAll('[data-control="interactive"]')).forEach(el => {
  const source = el.querySelector('[data-control="input-pug"] textarea').value;
  ReactDOM.render(<PugPreview initialCode={source} />, el);
});
