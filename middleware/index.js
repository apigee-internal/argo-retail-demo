var gzip = require('argo-gzip');
var router = require('argo-url-router');
var cors = require('./cors');
var formatter = require('./formatter');
var handlebars = require('./formatters/handlebars');
var siren = require('./formatters/siren');
var url = require('./url');

exports.cors = cors;
exports.gzip = gzip;
exports.formatter = formatter({
  engines: [handlebars, siren],
  override: {
    'application/json': siren
  }
});
exports.router = router;
exports.url = url;
