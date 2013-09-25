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
  var start = env.route.query.start;

  var previous = env.route.query.previous;

  if (previous) {
    previous = new Buffer(previous, 'base64').toString();
  }

  var options = {
    type: 'products',
    qs: { limit: 20 }
  };

  if (start) {
    options.cursor = start;
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
      entities: products,
      links: []
    };

    var prevLink, nextLink;
    
    if (start && !previous) {
      var uri = env.argo.uri();
      var parsed = url.parse(uri, true);
      parsed.search = null; 
      parsed.query = {};

      prevLink = { rel: ['prev'], href: url.format(parsed) };
      
    } else if (previous) {
      var uri = env.argo.uri();
      var parsed = url.parse(uri, true);
      parsed.search = null; 

      var p = previous.split('|');
      
      if (p.length > 1) {
        var startPrev = p.shift();
        parsed.query.start = startPrev;
        parsed.query.previous = new Buffer(p.join('|')).toString('base64');
      } else {
        parsed.query = { start: p[0] };
      }

      prevLink = { rel: ['prev'], href: url.format(parsed) };
    }

    if (result._next) {
      var uri = env.argo.uri();
      var parsed = url.parse(uri, true);
      parsed.search = null;
      parsed.query.start = result._next;

      if (previous) {
        parsed.query.previous = new Buffer(start + '|' + previous).toString('base64');
      } else if (start) {
        parsed.query.previous = new Buffer(start).toString('base64');
      }

      nextLink = { rel: ['next'], href: url.format(parsed) };
    }

    if (prevLink) {
      body.links.push(prevLink);
    }

    if (nextLink) {
      body.links.push(nextLink);
    }

    body.links.push({ rel: ['self'], href: uri });

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
