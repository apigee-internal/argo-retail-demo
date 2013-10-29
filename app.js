var setup = require('./setup');
var server = require('./server');

setup(function(err, container) {
  if (err) {
    return console.error(err);
  }

  server(container);
});
