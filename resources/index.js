var resource = require('argo-resource');
var calypso = require('calypso');
var mappings = require('../persistence/mappings');
var Product = require('../models/product');
var ProductsResource = require('./products_resource');
var UsergridSession = require('calypso-usergrid');

var options = {
  orgName: process.env.USERGRID_ORG_NAME || 'cosafinity',
  appName: process.env.USERGRID_APP_NAME || 'sandbox'
};

var session = UsergridSession.create(options, function(config) {
  config.add(mappings);
});

var factory = calypso.RepositoryFactory.create(session);

var productsRepository = factory.of(Product);

exports.products = resource(ProductsResource, productsRepository);
