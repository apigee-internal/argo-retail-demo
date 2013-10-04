var resource = require('argo-resource');
var mappings = require('../persistence/mappings');
var ProductsRepository = require('../persistence/products_repository');
var ProductsResource = require('./products_resource');
var Session = require('../persistence/orm/usergrid_session');

var opts = {
  org: process.env.USERGRID_ORG_NAME || 'cosafinity',
  app: process.env.USERGRID_APP_NAME || 'sandbox'
};

var session = Session.create(opts, function(config) { config.add(mappings); });

var repository = ProductsRepository.create(session);

exports.products = resource(ProductsResource, repository);
