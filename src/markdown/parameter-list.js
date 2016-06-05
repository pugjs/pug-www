import {compile as pugCompile} from '../../../pug';

const getTypeClass = str => {
  const typeToClass = {
    boolean: 'boolean',
    class: 'function',
    options: 'object',
    string: 'string',
  };

  if (str.indexOf('|') !== -1) {
    return '';
  } else {
    if (typeToClass[str]) {
      return typeToClass[str];
    } else if (str.toLowerCase().indexOf('array') === 0) {
      return 'array';
    } else {
      return '';
    }
  }
};

const getParams = (md, str) =>
  str.split('\n').reduce((params, curLine, i) => {
    curLine = curLine.trim();

    if (i % 3 === 0) {
      params.push({name: curLine});
    } else {
      let param = params[params.length - 1];
      curLine = curLine.substr(1).trim();

      if (i % 3 === 1) {
        param.class = getTypeClass(curLine);
        param.type = curLine;
      } else {
        param.description = md.renderInline(curLine);
      }
    }

    return params;
  }, []);

const template = pugCompile(`
dl(class=lang)
  each param in params
    dt= param.name
    dd.type(class=param.class)= param.type
    dd.description!= param.description
`);

export default ({md, str, lang}) => (
  template({
    lang,
    params: getParams(md, str)
  })
);
