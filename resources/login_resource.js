var querystring = require('querystring');
var url = require('url');
var request = require('request');
var Login = require('../models/login');

var LoginResource = module.exports = function(paths) {
  this.paths = paths;
};

LoginResource.prototype.init = function(config) {
  config
    .path(this.paths.login)
    .consumes('application/x-www-form-urlencoded')
    .produces('text/html')
    .get('/', this.form, { public: true })
    .post('/', this.login, { public: true });
};

LoginResource.prototype.form = function(env, next) {
  var parsed = url.parse(env.request.url, true);

  var model = Login.create({
    responseType: parsed.query.response_type,
    clientId: parsed.query.client_id,
    state: parsed.query.state,
    redirectUri: parsed.query.redirect_uri,
    url: env.helpers.url.path(this.paths.login)
  });

  env.format.render('login', model);
  next(env);
};

LoginResource.prototype.login = function(env, next) {
  env.request.getBody(function(err, body) {
    if (!body || !body.length) {
      env.response.statusCode = 400;
      return next(env);
    }

    body = querystring.parse(body.toString());

    var username = body.username;
    var password = body.password;
    var code = body.code;
    var state = body.state;

    var options = {
      method: 'GET',
      uri: 'https://api.usergrid.com/volos/retail/token?grant_type=password&username=' + username + '&password=' + password
    };

    request(options, function(err, res, body) {
      body = JSON.parse(body);

      var token = body.access_token;

      if (token) {
        env.oauth.authorize(env, next);
      } else { 
        env.response.statusCode = 401; // not authorized, make HTML page
        next(env);
      }
    });
  });
};
