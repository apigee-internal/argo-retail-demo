var gzip = require('argo-gzip');
var router = require('argo-url-router');
var cors = require('./cors');
var formatter = require('./formatter');
var handlebars = require('./formatters/handlebars');
var siren = require('./formatters/siren');

exports.cors = cors;
exports.gzip = gzip;
exports.router = router;
exports.formatter = formatter({
  engines: [handlebars, siren],
  override: {
    'application/json': siren
  }
});
