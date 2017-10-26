/* eslint-disable import/no-unassigned-import */
require('babel-register');
require('babel-polyfill');
/* eslint-enable import/no-unassigned-import */
require('./src').default().listen(process.env.PORT || 3000);

console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
