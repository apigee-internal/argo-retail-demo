var fs = require('fs');
var Handlebars = require('handlebars');

var HandlebarsEngine = function() {
  this.name = 'handlebars';
  this.mediaTypes = ['text/html'];
  this.extension = '.handlebars';
  this.subdirectory = '/html';
  this.cache = {};
};

HandlebarsEngine.prototype.format = function(filename, locals, cb) {
  if (this.cache.hasOwnProperty(filename)) {
    var template = this.cache[filename];
    var body = template(locals);
    return cb(null, body);
  }

  var self = this;
  fs.readFile(filename, function(err, contents) {
    if (err) {
      return cb(err);
    }

    var template = Handlebars.compile(contents.toString());
    self.cache[filename] = template;

    var body = template(locals);
    return cb(null, body);
  });
};

module.exports = new HandlebarsEngine();

