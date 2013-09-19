var usergrid = require('usergrid');

var Products = module.exports = function() {
  this.client = new usergrid.client({
    orgName:'kevinswiber',
    appName:'retail-demo'
  }); 
};

Products.prototype.init = function(config) {
  config
    .path('/products')
    .produces('application/json')
    .get('/', this.list)
    .get('/{name}', this.show);
};

Products.prototype.list = function(env, next) {
  var options = {
    type: 'products',
  };

  this.client.createCollection(options, function(err, result) {
    var products = [];

    while (result.hasNextEntity()) {
      var entity = result.getNextEntity();

      var product = {
        name: entity.get('name'),
        price: entity.get('price')
      };

      products.push(product);
    }

    env.response.body = products;

    next(env);
  });
};

Products.prototype.show = function(env, next) {
  var name = env.route.params.name;

  var options = {
    type: 'products',
    name: name,
    getOnExist: true
  };

  this.client.createEntity(options, function(err, entity) {
    var product = {
      name: entity.get('name'),
      price: entity.get('price')
    };

    env.response.body = product;

    next(env);
  });
};
