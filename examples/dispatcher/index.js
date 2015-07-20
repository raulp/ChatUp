var ChatUp = require('../../index.js');
var fs = require('fs');

var dispatcher = new ChatUp.Dispatcher({
  // ssl: {
  //   key: fs.readFileSync('/var/certs/streamup-key.pem'),
  //   cert: fs.readFileSync('/var/certs/streamup-cert.cert')
  // },
  // if not set, equals require('os').cpus().length
  //threads: 5,
  jwt: {
    key: require('fs').readFileSync(__dirname + '/../JWTKeyExample.pub').toString(),
    options: {
      algorithms: ["RS256"]
    }
  },
});

dispatcher.listen(8000, function() {
  console.log('Dispatcher listening on port 8000');
});
