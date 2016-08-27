import {compile} from 'pug';

const getParams = (md, str) =>
  str.trim().split('\n').reduce((params, curLine, i) => {
    curLine = curLine.trim();

    if (i % 3 === 0) {
      params.push({name: curLine});
    } else {
      const param = params[params.length - 1];
      curLine = curLine.substr(1).trim();

      if (i % 3 === 1) {
        param.type = curLine;
      } else {
        param.description = md.renderInline(curLine);
      }
    }

    return params;
  }, []);

const template = compile(`
dl.parameter-list(class={returns})
  each param in params
    dt #{param.name}#[span.type : #{param.type}]
    dd.description!= param.description
`);

export default ({md, str, config: {returns}}) => (
  template({
    params: getParams(md, str),
    returns
  })
);
