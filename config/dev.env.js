var {merge} = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  port: 5555,
  //https://github.com/zouhir/jarvis
  jarvisOpen: false,
  jarvisPort: 1337
});
