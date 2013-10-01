module.exports = function(handle) {
  handle('response', function(env, next) {
    env.response.getBody(function(err, body) {
      var types = ['application/json', 'application/vnd.siren+json'];
      if (types.indexOf(env.response.getHeader('content-type')) !== -1) {
        try {
          env.response.body = JSON.parse(body.toString());
        } catch(e) {
          console.log('error: unable to parse json from view:', env.view.name);
          console.error(e.stack);
          env.response.statusCode = 500;
          env.response.body = null;
        }
        next(env);
      } else {
        next(env);
      }
    });
  });
};
