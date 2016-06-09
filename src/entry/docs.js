import React from 'react';
import ReactDOM from 'react-dom';

import PugPreview from '../components/pug-preview.js';

window.ReactDOM = ReactDOM;
window.React = React;
window.PugPreview = PugPreview;

// Wait for the dynamically added style to kick in. CodeMirror dynamically
// measures line heights, which may change after the CSS is applied.
setTimeout(document => {
  [].slice.call(document.querySelectorAll('[data-control="interactive"]')).forEach((el, i) => {
    ReactDOM.render(<PugPreview files={demos[i]} />, el);
  });
}, 100, document);
