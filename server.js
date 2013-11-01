var http = require('http');
var titan = require('titan');
var handlebars = require('argo-formatter-handlebars');
var siren = require('argo-formatter-siren');
var ApigeeRuntime = require('volos/oauth/providers/apigee');
var OAuth = require('volos/oauth');
var config = require('./config');
var ResourceFactory = titan.ContainerResourceFactory;

module.exports = function(container) {
  var app = titan();

  var runtime = new ApigeeRuntime(config);
  var options = {
    validGrantTypes: ['authorization_code']
  };

  var oauthFactory = new OAuth(runtime, options);
  var oauth = oauthFactory.argoMiddleware({
    accessTokenUri: '/accesstoken'
  });

  app.use(oauth);
  app.allow('*');
  app.compress();
  app.logger();

  app.format({
    engines: [siren, handlebars],
    override: {
      'application/json': siren
    }
  });

  app.use(function(handler) {
    handler('resource:request:before', function(env, next) {
      if (env.resource.current.public) {
        return next(env);
      };

      env.oauth.authenticate(env, next);
    });

    handler('resource:request:before', function(env, next) {
      if (env.oauth.error) {
        env.resource.skip(true);
      }
      next(env);
    });
  });

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
