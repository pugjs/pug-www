/* eslint-env browser */
/* global demos */

import * as pug from 'pug';
import React from 'react';
import ReactDOM from 'react-dom';

import '../browser/menu'; // eslint-disable-line import/no-unassigned-import
import PugPreview from '../components/pug-preview';

window.pug = pug;

if (process.env.NODE_ENV !== 'production') {
  window.ReactDOM = ReactDOM;
  window.React = React;
  window.PugPreview = PugPreview;
}

[].slice.call(document.querySelectorAll('[data-control="interactive"]')).forEach((el, i) => {
  ReactDOM.render(<PugPreview {...demos[i]}/>, el);
});
