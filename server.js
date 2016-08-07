require('babel-register');
var app = require('./src').default;

app.listen(process.env.PORT || 3000);
console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
