import {resolve} from 'path';

export const md = (l, p) => resolve('..', `pug-${l}`, 'src', `${p}.md`);
export const tmpl = p => resolve('templates', `${p}.pug`);
