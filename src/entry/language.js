import pug from 'pug';
import React from 'react';
import ReactDOM from 'react-dom';

import PugPreview from '../components/pug-preview.js';

window.pug = pug;

// window.ReactDOM = ReactDOM;
// window.React = React;
// window.PugPreview = PugPreview;

[].slice.call(document.querySelectorAll('[data-control="interactive"]')).forEach((el, i) => {
  ReactDOM.render(<PugPreview {...demos[i]} />, el);
});
