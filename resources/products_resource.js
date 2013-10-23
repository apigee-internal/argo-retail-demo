var Product = require('../models/product');
var ProductList = require('../models/product_list');
var Query = require('calypso').Query;

var ProductsResource = module.exports = function(repository, paths) {
  this.repository = repository;
  this.paths = paths;
};

ProductsResource.prototype.init = function(config) {
  config
    .path(this.paths.products)
    .produces('application/json')
    .produces('application/vnd.siren+json')
    .produces('text/html')
    .get('/', this.list)
    .get('/{id}', this.show);
};

ProductsResource.prototype.list = function(env, next) {
  var term = env.route.query.search;
  var productsPath = this.paths.products;
  var query = Query.of(Product);
  
  if (term) {
    query
      .where('name', { contains: term })
  }

  this.repository.find(query, function(err, results) {
    var urlHelper = env.helpers.url;

    var items = results.map(function(product) {
      product.selfUrl = urlHelper.join(product.id);
      return product;
    });

    var list = ProductList.create({
      items: items,
      term: term,
      searchUrl: urlHelper.path(productsPath),
      selfUrl: urlHelper.current()
    });

    env.format.render('products', list);

    next(env);
  });
};

ProductsResource.prototype.show = function(env, next) {
  var id = env.route.params.id;
  var urlHelper = env.helpers.url;

  var productsPath = this.paths.products;

  this.repository.get(id, function(err, product) {
    if (err) {
      env.response.statusCode = 404;
      return next(env);
    }

    product.selfUrl = urlHelper.current();
    product.collectionUrl = urlHelper.path(productsPath);

    env.format.render('product', product);

    next(env);
  });
};
