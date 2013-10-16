var calypso = require('calypso');
var resource = require('argo-resource');
var UsergridDriver = require('calypso-usergrid');
var mappings = require('./persistence/mappings');
var Product = require('./models/product');
var ProductsResource = require('./resources/products_resource');

var paths = {
  products: '/products'
};

ProductsResource.prototype.init = function(config) {
  config
    .path(paths.products)
    .produces('application/json')
    .produces('application/vnd.siren+json')
    .produces('text/html')
    .get('/', this.list)
    .get('/{id}', this.show);
};

var engine = calypso.configure({
  driver: new UsergridDriver({
    orgName: 'cosafinity',
    appName: 'sandbox'
  }),
  mappings: mappings
});

module.exports = function(cb) {
  engine.build(function(err, connection) {
    if (err) {
      return cb(err);
    }

    var session = connection.createSession();

    var factory = calypso.RepositoryFactory.create(session);
    var productsRepository = factory.of(Product);

    var resources = {
      products: resource(ProductsResource, productsRepository, paths)
    };

    cb(null, resources);
  });
};

