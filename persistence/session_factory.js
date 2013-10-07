var UsergridSession = require('./orm/usergrid_session');

exports.create = function(configFunc) {
  var opts = {
    org: process.env.USERGRID_ORG_NAME || 'cosafinity',
    app: process.env.USERGRID_APP_NAME || 'sandbox'
  };

  return UsergridSession.create(opts, configFunc);
};
