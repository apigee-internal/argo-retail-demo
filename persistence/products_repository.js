var Query = require('./orm/query');
var Product = require('../models/product');

var ProductsRepository = module.exports = function(session) {
  this.session = session;
};

ProductsRepository.create = function(session) {
  return new ProductsRepository(session);
};

ProductsRepository.prototype.find = function(query, cb) {
  this.session.find(query, cb);
};

ProductsRepository.prototype.get = function(id, cb) {
  var query = Query.of(Product)

  this.session.get(query, id, cb);
};
