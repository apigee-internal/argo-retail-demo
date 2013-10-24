var calypso = require('calypso');
var iv = require('iv');
var UsergridDriver = require('calypso-usergrid');
var mappings = require('./persistence/mappings');
var Product = require('./models/product');
var ProductsResource = require('./resources/products_resource');
var RepositoryFactory = calypso.RepositoryFactory;

var engine = calypso.configure({
  driver: new UsergridDriver({
    orgName: 'cosafinity',
    appName: 'sandbox'
  }),
  mappings: mappings
});

module.exports = function(server, cb) {
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
    var value = container.value;
    var component = container.component;

    container.register([{
      name: 'repository:products',
      value: value(productsRepository)
    },
    {
      name: 'paths',
      value: value(paths)
    },
    {
      name: 'resource:products',
      value: ProductsResource,
      params: [component('repository:products'), component('paths')]
    }]);

    server.add(ProductsResource, productsRepository, paths);

    cb(null);
  });
};
