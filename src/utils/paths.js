import {join, resolve} from 'path';

export const projRoot = resolve(__dirname, '..', '..');

export const lang = l => resolve(projRoot, '..', `pug-${l}`);
export const strs = l => join(lang(l), 'strings.json');
export const md = (l, p) => join(lang(l), 'src', `${p}.md`);

export const tmpl = p => join(projRoot, 'templates', `${p}.pug`);
export const scss = p => join(projRoot, 'scss', `${p}.scss`);
