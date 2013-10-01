var path = require('path');
var url = require('url');
var ProductsRepository = require('../data/products_repository');

var Products = module.exports = function() {
  this.repository = new ProductsRepository();
};

Products.prototype.init = function(config) {
  config
    .path('/products')
    .produces('application/json')
    .produces('application/vnd.siren+json')
    .get('/', this.list)
    .get('/{id}', this.show);
};

Products.prototype.list = function(env, next) {
  var term;

  var queryParams = env.route.query;
  if (queryParams && queryParams.search) {
    term = queryParams.search;
  }

  var query = this.repository.createQuery();

  if (term) {
    query 
      .where('name')
      .contains(term);
  }

  this.repository.find(query, function(err, results) {
    var uri = env.argo.uri();
    var entities = [];

    results.forEach(function(product, i) {
      var parsed = url.parse(uri);
      parsed.search = null;
      parsed.pathname = path.join(parsed.pathname, product.id);

      var entity = {
        product: product,
        hasNext: (i < (results.length - 1)),
        self: url.format(parsed)
      };

      entities.push(entity);
    });

    var parsed = url.parse(uri);
    parsed.search = null;
    parsed.pathname = '/products';

    var locals = {
      entities: entities,
      search: url.format(parsed),
      self: uri,
      term: term,
      hasSearchResults: !!term 
    };

    env.view.render('products', locals);

    next(env);
  });
};

Products.prototype.show = function(env, next) {
  var id = env.route.params.id;

  this.repository.get(id, function(err, result) {
    if (err) {
      env.response.statusCode = 404;
      return next(env);
    }

    var uri = env.argo.uri();
    var parsed = url.parse(uri);
    parsed.search = parsed.query = null;
    parsed.pathname = '/products';

    var locals = {
      product: result,
      collection: url.format(parsed)
    };

    env.view.render('product', locals);

    next(env);
  });
};
