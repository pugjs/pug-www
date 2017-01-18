import {readFile} from 'then-fs';
import loadLanguage from './load-language';

function readLocalizedFile(language, path, encoding) {
  return loadLanguage(language).then(directory => {
    return readFile(directory + path, encoding);
  });
}
export default readLocalizedFile;
