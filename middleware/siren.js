var path = require('path');

module.exports = function(options) {
  options = options || {};

  var directory = options.directory || path.join(process.cwd(), '/formats');

  return function(handle) {
    handle('request', function(env, next) {
      env.format = {
        name: null,
        locals: null,
        render: function(name, locals) {
          env.format.name = name;
          env.format.locals = locals;
        }
      };

      next(env);
    });

    handle('response', function(env, next) {
      if (!env.format.name) {
        return next(env);
      }

      var template = require(path.join(directory, '/' + env.format.name + '.siren.js'));
      env.response.body = template(env.format.locals);
      next(env);
    });
  };
};

