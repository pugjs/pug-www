import {PropTypes} from 'react';

export default {
  attributes: PropTypes.object.isRequired,
  defaultLang: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  strings: PropTypes.object.isRequired,
};
