var resource = require('argo-resource');
var mappings = require('../persistence/mappings');
var Product = require('../models/product');
var ProductsResource = require('./products_resource');
var RepositoryFactory = require('../persistence/orm/repository_factory');
var UsergridSession = require('../persistence/usergrid_session');

var options = {
  org: process.env.USERGRID_ORG_NAME || 'cosafinity',
  app: process.env.USERGRID_APP_NAME || 'sandbox'
};

var session = UsergridSession.create(options, function(config) {
  config.add(mappings);
});

var factory = RepositoryFactory.create(session);

var productsRepository = factory.of(Product);

exports.products = resource(ProductsResource, productsRepository);
