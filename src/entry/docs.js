import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PugPreview from '../components/browser/pug-preview.js';

window.ReactDOM = ReactDOM;
window.React = React;
window.PugPreview = PugPreview;

[].slice.call(document.querySelectorAll('[data-control="interactive"]')).forEach(el => {
  const source = el.querySelector('[data-control="input-pug"]').innerText;
  ReactDOM.render(<PugPreview initialCode={source} />, document.getElementsByClassName('container')[0]);
});
