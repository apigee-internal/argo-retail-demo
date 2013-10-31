var Login = module.exports = function() {
  this.url = null;
  this.scope = null;
  this.clientId = null;
  this.responseType = null;
  this.redirectUri = null;
};

Login.create = function(fill) {
  var login = new Login();
  login.url = fill.url;
  login.scope = fill.scope;
  login.clientId = fill.clientId;
  login.responseType = fill.responseType;
  login.redirectUri = fill.redirectUri;

  return login;
};
