var ug = require('usergrid'),
    token = "YWMtSZNImkFlEeOiDUGXdh9GvQAAAUItjUkRJOp2BF9JZxir-UWAWDPon6rYYQg",
    apigee = new ug.client({
      orgName:"volos",
      appName:"retail",
      authType:ug.AUTH_APP_USER
    });
var WishlistResource = module.exports = function() {

}

WishlistResource.prototype.init = function(config) {
  config
    .produces('application/json')
    .get('/{user}/lists/{name}/products', this.getList)
    .post('/{user}/lists/{name}/products/{product}', this.addToList);
};

WishlistResource.prototype.getList = function(env, next) {
  var listName = env.route.params.name;

  apigee.setToken(token);

  apigee.getLoggedInUser(function(error, data, user) {
    user.getConnections("list_"+listName, function(error, data, entities) {
      if(error) {
        console.log("error");
        console.log(arguments);
        env.response.body = data;
        env.response.statusCode = 500;
      } else {
        env.response.body = data;
        env.response.statusCode = 200;
      }
      next(env);
    });
  });
};

WishlistResource.prototype.addToList = function(env, next) {
  var listName = env.route.params.name;
  var product = env.route.params.product;

  apigee.setToken(token);

  apigee.getLoggedInUser(function(error, data, user) {
    var entityOpts = {
      type: "products",
      uuid: product
    }

    apigee.getEntity(entityOpts, function(error, entity, data) {
      if(error) {
        env.response.body = data;
        env.response.statusCode = 500;
        next(env);
      } else {
        user.connect("list_"+listName, entity, function(error, data) {
          if(error) {
            env.response.body = data;
            env.response.statusCode = 500;
          } else {
            env.response.body = data;
            env.response.statusCode = 200;
          }
          next(env);
        });
      }
    });
  });
};

