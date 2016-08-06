import acceptLanguage from 'accept-language';
import langs from '../../langs.json';

acceptLanguage.languages(langs);
const languages = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];
document.location = '/' + acceptLanguage.get(languages.join(', ')) + '/';
