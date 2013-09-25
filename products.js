var path = require('path');
var url = require('url');
var usergrid = require('usergrid');

var Products = module.exports = function() {
  this.client = new usergrid.client({
    orgName:'cosafinity',
    appName:'sandbox'
  }); 
};

Products.prototype.init = function(config) {
  config
    .path('/products')
    .produces('application/json')
    .produces('application/vnd.siren+json')
    .get('/', this.list)
    .get('/{name}', this.show);
};

Products.prototype.list = function(env, next) {
  var search;

  var query = env.route.query;
  if (query && query.search) {
    search = query.search;
  }

  var options = {
    type: 'products',
    qs: { limit: 10 }
  };

  if (search) {
    options.qs.ql =
      'select * where productname contains \'' + search + '\'';
  }

  this.client.createCollection(options, function(err, result) {
    var products = [];

    while (result.hasNextEntity()) {
      var entity = result.getNextEntity();


      var product = {
        class: ['product'],
        rel: ['item'],
        properties: {
          id: entity.get('name'),
          name: entity.get('productname'),
          image: entity.get('productimage')
        },
        links: []
      };

      var uri = env.argo.uri();
      var parsed = url.parse(uri);
      parsed.search = parsed.query = null;
      parsed.pathname = path.join(parsed.pathname, product.properties.id);

      product.links.push({ rel: ['self'], href: url.format(parsed) });

      products.push(product);
    }

    var uri = env.argo.uri();
    var parsed = url.parse(uri);
    parsed.search = parsed.query = null;
    parsed.pathname = '/products';

    var body = {
      class: ['products'],
      properties: {},
      entities: products,
      actions: [],
      links: [{ rel: ['self'], href: uri }]
    };

    if (search) {
      body.class.push('search-results');
      body.properties.term = search;
      delete body.actions;
    } else {
      delete body.properties;
      body.actions.push({
        method: 'GET',
        href: env.argo.uri(),
        fields: [{ name: 'search', type: 'text' }]
      });
    }

    env.response.body = body;

    next(env);
  });
};

Products.prototype.show = function(env, next) {
  var name = env.route.params.name;

  var options = {
    type: 'products',
    name: name
  };

  this.client.getEntity(options, function(err, entity) {
    if (err) {
      env.response.statusCode = 404;
      return next(env);
    }

    var uri = env.argo.uri();
    var parsed = url.parse(uri);
    parsed.search = parsed.query = null;
    parsed.pathname = '/products';

    var product = {
      class: ['product'],
      properties: {
        id: entity.get('name'),
        name: entity.get('productname'),
        image: entity.get('productimage')
      },
      links: [{ rel: ['collection'], href: url.format(parsed) }]
    };

    env.response.body = product;

    next(env);
  });
};
