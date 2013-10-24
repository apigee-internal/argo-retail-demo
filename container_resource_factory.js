var resource = require('argo-resource');

var ContainerResourceFactory = module.exports = function() {
  this.container = null;
};

ContainerResourceFactory.prototype.setContainer = function(container) {
  this.container = container;
};

ContainerResourceFactory.prototype.resolve = function() {
  var names = Object.keys(this.container.entries);

  var self = this;
  names.filter(function(name) {
    var prefix = 'resource:';
    return name.substr(0, prefix.length) === prefix;
  }).map(function(name) {
    var entry = self.container.entries[name];
    var res = self.container.resolve(name);
    return resource();
  });
};
