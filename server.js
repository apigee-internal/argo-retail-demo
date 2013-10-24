var titan = require('titan');
var ResourceFactory = titan.ContainerResourceFactory;
var handlebars = require('argo-formatter-handlebars');
var siren = require('argo-formatter-siren');
var cors = require('./middleware/cors');
var setup = require('./setup');

var port = process.env.PORT || 3000;


setup(function(err, container) {
  titan()
    .use(cors)
    .setResourceFactory(ResourceFactory.create(container))
    .format({
      engines: [handlebars, siren],
      override: {
        'application/json': siren
      }
    })
    .listen(port);
});
