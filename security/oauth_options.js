var oauth2 = require('../');
var usergridUserStrategy = require('./usergrid_user_strategy');

var clientStrategy = new oauth2.InMemoryClientStrategy({
  authStrategy: 'params',
  clients: [{
    id: 'client', 
    secret: 'secr3t',
    grantTypes: ['authorization_code', 'client_credentials'],
    redirectUris: ['http://localhost:3001/cb'],
    status: 'active'
  }]
});

var userStrategy = usergridUserStrategy({
  orgName: 'cosafinity',
  appName: 'sandbox',
});

module.exports = {
  clientStrategy: clientStrategy,
  userStrategy: userStrategy,
  endpoints: {
    authorization: '/authorize',
    token: '/token'
  },
  supported: {
    'authorization_code': 'bearer'
  }
};
