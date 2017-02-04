import React from 'react';
import DocDownPage from 'doc-down/lib/page';
import CodeComponent from './code-component';
import customElements from './custom-elements';

function App({lang, path, attributes, body}) {
  return pug`
    DocDownPage(data=body codeComponent=CodeComponent customElements=customElements)
  `;
}

export default App;
