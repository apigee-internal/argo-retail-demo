var usergrid = require('usergrid');
var domain = require('../models').domain;
var query = require('./query');

var Product = domain.Product;

var ProductsRepository = module.exports = function() {
  this.client = new usergrid.client({
    orgName: process.env.USERGRID_ORG_NAME || 'cosafinity',
    appName: process.env.USERGRID_APP_NAME || 'sandbox'
  }); 
};

ProductsRepository.create = function() {
  return new ProductsRepository();
};

ProductsRepository.prototype.createQuery = function() {
  var map = {
    id: 'name',
    name: 'productname',
    image: 'productimage'
  };

  return query.create(map);
}

ProductsRepository.prototype.find = function(query, cb) {
  var options = {
    type: 'products',
    qs: { limit: 10 }
  };

  if (query) {
    options.qs.ql = query.toString();
  }

  this.client.createCollection(options, function(err, result) {
    var products = [];

    while (result.hasNextEntity()) {
      var entity = result.getNextEntity();

      var product = Product.create(entity.get('name'),
        entity.get('productname'), entity.get('productimage'));

      products.push(product);
    }

    cb(err, products);
  });

};

ProductsRepository.prototype.get = function(id, cb) {
  var options = {
    type: 'products',
    name: id
  };

  this.client.getEntity(options, function(err, entity) {
    var product;

    if (!err) {
      var product = Product.create(entity.get('name'),
        entity.get('productname'), entity.get('productimage'));
    }

    cb(err, product);
  });
};
