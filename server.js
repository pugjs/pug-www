require('babel-register');
require('./src').default.listen(process.env.PORT || 3000);

console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
