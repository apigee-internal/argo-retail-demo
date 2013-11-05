var http = require('http');
var titan = require('titan');
var handlebars = require('argo-formatter-handlebars');
var siren = require('argo-formatter-siren');
var ApigeeRuntime = require('volos-oauth-apigee');
var OAuth = require('volos-oauth-common');
var config = require('./config');
var ResourceFactory = titan.ContainerResourceFactory;

module.exports = function(container) {
  var app = titan();

  if (process.env.USE_OAUTH) {
    config.validGrantTypes = ['authorization_code'];

    var oauthFactory = ApigeeRuntime.create(config);
    var oauth = oauthFactory.argoMiddleware({
      accessTokenUri: '/accesstoken'
    });

    app.use(oauth);

    app.use(function(handler) {
      handler('resource:request:before', function(env, next) {
        if (env.resource.current.public) {
          return next(env);
        };

        next(env);
        env.oauth.authenticate(env, next);
      });

      handler('resource:request:before', function(env, next) {
        if (env.oauth && env.oauth.error) {
          env.resource.skip(true);
        }
        next(env);
      });
    });
  }

  app.allow('*');
  app.compress();
  app.logger();

  app.format({
    engines: [siren, handlebars],
    override: {
      'application/json': siren
    }
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
