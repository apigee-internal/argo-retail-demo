var titan = require('titan');
var handlebars = require('argo-formatter-handlebars');
var siren = require('argo-formatter-siren');
var setup = require('./setup');

setup(function(err, container) {
  var port = process.env.PORT || 3000;
  var factory = titan.ContainerResourceFactory.create(container);

  titan()
    .allow('*')
    .compress()
    .format({
      engines: [handlebars, siren],
      override: {
        'application/json': siren
      }
    })
    .load(factory)
    .listen(port);
});
