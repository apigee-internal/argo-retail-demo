var Product = require('../models/product');
var ProductList = require('../models/product_list');
var Query = require('../persistence/orm/query');

var ProductsResource = module.exports = function(repository) {
  this.repository = repository;
};

ProductsResource.prototype.init = function(config) {
  config
    .path('/products')
    .produces('application/json')
    .produces('application/vnd.siren+json')
    .produces('text/html')
    .get('/', this.list)
    .get('/{id}', this.show);
};

ProductsResource.prototype.list = function(env, next) {
  var term = env.route.query.search;
  var query = Query.of(Product);
  
  if (term) {
    query
      .where('name', { contains: term })
  }

  this.repository.find(query, function(err, results) {
    var items = [];
    var urlHelper = env.helpers.url;

    results.forEach(function(product) {
      product.selfUrl = urlHelper.join(product.id);

      items.push(product);
    });

    var list = ProductList.create({
      items: items,
      term: term,
      searchUrl: urlHelper.path('/products'),
      selfUrl: urlHelper.current()
    });

    env.format.render('products', list);

    next(env);
  });
};

ProductsResource.prototype.show = function(env, next) {
  var id = env.route.params.id;
  var urlHelper = env.helpers.url;

  this.repository.get(id, function(err, product) {
    if (err) {
      env.response.statusCode = 404;
      return next(env);
    }

    product.selfUrl = urlHelper.current();
    product.collectionUrl = urlHelper.path('/products');

    env.format.render('product', product);

    next(env);
  });
};
