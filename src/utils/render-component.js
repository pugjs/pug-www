
import React from 'react';
import {renderToString} from 'react-dom/server';

export default (...args) => {
  const element = React.createElement.apply(React, args);
  return renderToString(element);
};
