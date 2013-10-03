var path = require('path');
var url = require('url');
var Product = require('../models/product');
var ProductList = require('../models/product_list');
var Query = require('../persistence/orm/query');

var Products = module.exports = function(repository) {
  this.repository = repository;
};

Products.prototype.init = function(config) {
  config
    .path('/products')
    .produces('application/json')
    .produces('application/vnd.siren+json')
    .produces('text/html')
    .get('/', this.list)
    .get('/{id}', this.show);
};

Products.prototype.list = function(env, next) {
  var term = env.route.query.search;

  var query = Query.of(Product);

  if (term) {
    query
      .where('name', { contains: term })
  }

  this.repository.find(query, function(err, results) {
    var uri = env.argo.uri();
    var items = [];

    results.forEach(function(product) {
      var parsed = url.parse(uri);
      parsed.search = null;
      parsed.pathname = path.join(parsed.pathname, product.id);

      product.selfUrl = url.format(parsed);

      items.push(product);
    });

    var parsed = url.parse(uri);
    parsed.search = null;
    parsed.pathname = '/products';

    var list = new ProductList();
    list.items = items;
    list.term = term;
    list.searchUrl = url.format(parsed);
    list.selfUrl = uri;

    env.format.render('products', list);

    next(env);
  });
};

Products.prototype.show = function(env, next) {
  var id = env.route.params.id;

  this.repository.get(id, function(err, product) {
    if (err) {
      env.response.statusCode = 404;
      return next(env);
    }

    var uri = env.argo.uri();
    var parsed = url.parse(uri);
    parsed.search = null;
    parsed.pathname = '/products';

    product.selfUrl = uri;
    product.collectionUrl = url.format(parsed);

    env.format.render('product', product);

    next(env);
  });
};
