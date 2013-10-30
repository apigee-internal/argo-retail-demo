var http = require('http');
var titan = require('titan');
var siren = require('argo-formatter-siren');
//var ApigeeRuntime = require('volos/oauth/providers/apigee');
//var OAuth = require('volos/oauth');
//var config = require('./config');
var ResourceFactory = titan.ContainerResourceFactory;

module.exports = function(container) {
  var app = titan();

  /*var runtime = new ApigeeRuntime(config);
  var options = {
    validGrantTypes: ['client_credentials'],
    passwordCheck: function() { return true; }
  };

  var oauthFactory = new OAuth(runtime, options);
  var oauth = oauthFactory.argoMiddleware({
    authorizeUri: '/authorize',
    accessTokenUri: '/accesstoken'
  });

  app.use(oauth);*/
  app.allow('*');
  app.compress();
  app.logger();

  app.format({
    engines: [siren],
    override: {
      'application/json': siren
    }
  });

  /*app.use(function(handler) {
    handler('resource:request:before', function(env, next) {
      console.log(env.response.statusCode);
      if (env._oauthAuthenticated === false ||
          [400, 500].indexOf(env.response.statusCode) !== -1) {
        console.log(env.response.statusCode);

        env.resource.skip(true);
        console.log('skipping resource');
      } else {
        console.log('executing resource');
      }

      next(env);
    });
  });*/

  app.load(ResourceFactory.create(container));

  app.error(function(env, error, next) {
    console.error(error.stack);
    env.response.statusCode = 500;
    env.response.body = 'Internal Server Error';

    server.close();
    next(env);
  });

  var port = process.env.PORT || 3000;
  var server = http.createServer(app.build().run).listen(port);
};
