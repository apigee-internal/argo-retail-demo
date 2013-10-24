var titan = require('titan');
var handlebars = require('argo-formatter-handlebars');
var siren = require('argo-formatter-siren');
var ContainerResourceFactory = require('./container_resource_factory');
var cors = require('./middleware/cors');
var setup = require('./setup');

var port = process.env.PORT || 3000;

var resourceFactory = new ContainerResourceFactory();

var server = titan()
  .setResourceFactory(resourceFactory)
  .use(cors)
  .format({
    engines: [handlebars, siren],
    override: {
      'application/json': siren
    }
  });

setup(resourceFactory, function(err) {
  server.listen(port);
});
