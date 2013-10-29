var calypso = require('calypso');
var iv = require('iv');
var UsergridDriver = require('calypso-usergrid');
var mappings = require('./persistence/mappings');
var Product = require('./models/product');
var ProductsResource = require('./resources/products_resource');
var RepositoryFactory = calypso.RepositoryFactory;

var engine = calypso.configure({
  driver: new UsergridDriver({
    orgName: 'volos',
    appName: 'retail'
  }),
  mappings: mappings
});

module.exports = function(cb) {
  engine.build(function(err, connection) {
    if (err) {
      return cb(err);
    }

    var session = connection.createSession();

    var factory = RepositoryFactory.create(session);
    var productsRepository = factory.of(Product);

    var paths = {
      products: '/products'
    };

    var container = iv.create();

    container.register([{
      name: 'resource:products',
      value: ProductsResource,
      params: [productsRepository, paths]
    }]);

    cb(null, container);
  });
};
