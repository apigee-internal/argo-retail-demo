var usergrid = require('usergrid');
var ConstructorMap = require('./constructor_map');
var SessionConfig = require('./session_config');

var Session = module.exports = function() {
  this.config = null;
  this.client = null;
};

Session.prototype.init = function(config) {
  this.config = config;
  this.client = new usergrid.client({
    orgName: this.config.organization,
    appName: this.config.application
  }); 
};

function convertToModel(config, entity) {
  var obj = Object.create(config.constructor.prototype);
  var keys = Object.keys(config.fieldMap);
  
  keys.forEach(function(key) {
    var prop = config.fieldMap[key] || key;
    obj[key] = entity.get(prop);
  });

  return obj;
}

Session.prototype.find = function(query, cb) {
  var config = query.modelConfig;

  var options = {
    type: config.collection,
    qs: { limit: 10 }
  };

  if (query) {
    options.qs.ql = query.toString();
  }

  this.client.createCollection(options, function(err, result) {
    var entities = [];

    while (result.hasNextEntity()) {
      var entity = result.getNextEntity();

      var obj = convertToModel(config, entity);
      
      entities.push(obj);
    }

    cb(err, entities);
  });
};

Session.prototype.get = function(query, id, cb) {
  var config = query.modelConfig;

  var options = {
    type: config.collection,
    name: id
  };

  this.client.getEntity(options, function(err, result) {
    var obj;

    if (!err) {
      obj = convertToModel(config, result);
    }

    cb(err, obj);
  });
};

Session.create = function(configFunc) {
  var session = new Session();
  var config = new SessionConfig(session);

  configFunc(config);

  session.init(config);

  return session;
};
