import React from 'react';

function Alert({level, title, children}) {
  return pug`
    div.alert(className='alert-' + (level || 'info'))
      h6= title
      = children
  `;
}

export default Alert;
