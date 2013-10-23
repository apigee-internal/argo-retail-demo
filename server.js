var handlebars = require('argo-formatter-handlebars');
var siren = require('argo-formatter-siren');
var titan = require('titan');
var middleware = require('./middleware');
var setup = require('./setup');

var port = process.env.PORT || 3000;

var server = titan()
  .use(middleware.cors)
  .use(middleware.gzip)
  .use(middleware.url)
  .format({
    engines: [handlebars, siren],
    override: {
      'application/json': siren
    }
  });

setup(server, function(err) {
  server.listen(port);
});
