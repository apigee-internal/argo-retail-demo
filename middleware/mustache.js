var fs = require('fs');
var path = require('path');
var Mustache = require('mustache')

module.exports = function(options) {
  options = options || {};

  var directory = options.directory || path.join(process.cwd(), '/views');

  return function(handle) {
    handle('request', function(env, next) {
      env.view = {
        name: null,
        locals: null,
        cache: {},
        render: function(view, locals) {
          env.view.name = view;
          env.view.locals = locals;
        }
      };

      next(env);
    });

    handle('response', function(env, next) {
      if (!env.view.name) {
        return next(env);
      }


      if (env.view.cache.hasOwnProperty(env.view.name)) {
        var template = env.view.cache[env.view.name];
        env.response.body = Mustache.render(template, env.view.locals);
        return next(env);
      }

      fs.readFile(path.join(directory, '/' + env.view.name + '.mustache'), function(err, res) {
        env.response.body = Mustache.render(res.toString(), env.view.locals);
        next(env);
      });
    });
  };
};
