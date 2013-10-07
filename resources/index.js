var resource = require('argo-resource');
var mappings = require('../persistence/mappings');
var Product = require('../models/product');
var ProductsResource = require('./products_resource');
var RepositoryFactory = require('../persistence/repository_factory');
var SessionFactory = require('../persistence/session_factory');

var session = SessionFactory.create(function(config) {
  config.add(mappings);
});

var factory = RepositoryFactory.create(session);
var productsRepository = factory.of(Product);

exports.products = resource(ProductsResource, productsRepository);
