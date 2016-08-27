import {renderFile} from 'pug';

import {tmpl} from '../utils/paths.js';
import dynInclude from './dyninclude.js';

export default lang => renderFile(tmpl('index'), {
  plugins: [
    dynInclude({lang})
  ]
});
