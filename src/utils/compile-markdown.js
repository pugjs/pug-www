import DocDown from 'doc-down';

const dd = new DocDown();

function compileMarkdown(filename, src) {
  return dd.parse(filename, src);
}

export default compileMarkdown;
