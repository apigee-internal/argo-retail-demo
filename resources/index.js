var resource = require('argo-resource');
var OrmSession = require('../persistence/orm/session');

var ProductMap = require('../persistence/mappings/product_map');
var ProductsRepository = require('../persistence/products_repository');
var ProductsResource = require('./products_resource');

var session = OrmSession.create(function(config) {
  config
    .org(process.env.USERGRID_ORG_NAME || 'cosafinity')
    .app(process.env.USERGRID_APP_NAME || 'sandbox')
    .map(ProductMap);
});

var repository = ProductsRepository.create(session);

exports.products = resource(ProductsResource, repository);
