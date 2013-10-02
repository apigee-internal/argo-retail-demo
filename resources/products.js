var path = require('path');
var url = require('url');
var Product = require('../models/product');
var ProductList = require('../models/product_list');
var ProductListItem = require('../models/product_list_item');

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
  var term;

  var queryParams = env.route.query;
  if (queryParams && queryParams.search) {
    term = queryParams.search;
  }

  var query;

  if (term) {
    query = this.repository.createQuery()
      .select('*')
      .where('name')
      .contains(term);
  } else {
    query = this.repository.createQuery()
      .select('*')
  }

  this.repository.find(query, function(err, results) {
    var uri = env.argo.uri();
    var items = [];

    results.forEach(function(product, i) {
      var parsed = url.parse(uri);
      parsed.search = null;
      parsed.pathname = path.join(parsed.pathname, product.id);

      var item = new ProductListItem();
      item.id = product.id;
      item.name = product.name;
      item.image = product.image;
      item.selfUrl = url.format(parsed);

      items.push(item);
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
