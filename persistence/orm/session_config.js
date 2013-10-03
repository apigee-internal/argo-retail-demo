var ConstructorMap = require('./constructor_map');

var SessionConfig = module.exports = function(session) {
  this.session = session;

  this.organization = null;
  this.application = null;
  this.mappings = [];
};

SessionConfig.prototype.org = function(org) {
  this.organization = org;
  return this;
};

SessionConfig.prototype.app = function(app) {
  this.application = app;
  return this;
};

SessionConfig.prototype.map = function(mapping) {
  var constructorMap = new ConstructorMap();
  mapping(constructorMap);

  this.mappings.push(constructorMap);

  return this;
};
