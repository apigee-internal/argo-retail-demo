var titan = require('titan');
var handlebars = require('argo-formatter-handlebars');
var siren = require('argo-formatter-siren');
var cors = require('./middleware/cors');
var setup = require('./setup');

var port = process.env.PORT || 3000;

var server = titan()
  .use(cors)
  .format({
    engines: [handlebars, siren],
    override: {
      'application/json': siren
    }
  });

setup(server, function(err) {
  server.listen(port);
});
