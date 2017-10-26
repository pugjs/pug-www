import {renderFile} from 'pug';

import {tmpl} from '../utils/paths';
import dynInclude from './dyninclude';

export default lang => renderFile(tmpl('index'), {
  plugins: [
    dynInclude({lang})
  ]
});
