require('babel-register');
require('babel-polyfill');
require('./src').default().listen(process.env.PORT || 3000);

console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
