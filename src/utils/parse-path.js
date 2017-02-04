import config from '../config';

function parsePath(pathString) {
  const path = pathString.split('/');
  if (config.supportedLanguages.includes(path[1]) && path[1] !== config.defaultLanguage) {
    return {
      lang: path[1],
      path: '/' + path.slice(2).join('/'),
    };
  }
  return {lang: config.defaultLanguage, path: pathString};
}

export default parsePath;
