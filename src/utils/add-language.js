import config from '../config';

function addLanguage(language, pathString) {
  if (language === config.defaultLanguage) {
    return pathString;
  } else {
    return '/' + language + pathString;
  }
}

export default addLanguage;
