var resource = require('argo-resource');
var mullet = require('mullet');
var mappings = require('../persistence/mappings');
var Product = require('../models/product');
var ProductsResource = require('./products_resource');

var options = {
  org: process.env.USERGRID_ORG_NAME || 'cosafinity',
  app: process.env.USERGRID_APP_NAME || 'sandbox'
};

var session = mullet.UsergridSession.create(options, function(config) {
  config.add(mappings);
});

var factory = mullet.RepositoryFactory.create(session);

var productsRepository = factory.of(Product);

exports.products = resource(ProductsResource, productsRepository);
