var resource = require('argo-resource');

var ProductsRepository = require('../persistence/products_repository');
var Session = require('../persistence/orm/session');
var ProductMap = require('../persistence/mappings/product_map');

var Products = require('./products');

var session = Session.create(function(config) {
  config
    .org(process.env.USERGRID_ORG_NAME || 'cosafinity')
    .app(process.env.USERGRID_APP_NAME || 'sandbox')
    .map(ProductMap);
});

var repository = ProductsRepository.create(session);

exports.products = resource(Products, repository);
