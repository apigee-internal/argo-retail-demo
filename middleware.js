var gzip = require('argo-gzip');
var router = require('argo-url-router');
var cors = require('./middleware/cors');
var formatter = require('./middleware/formatter');
var handlebars = require('./middleware/formatters/handlebars');
var siren = require('./middleware/formatters/siren');

exports.cors = cors;
exports.gzip = gzip;
exports.router = router;
exports.formatter = formatter({
  engines: [handlebars, siren],
  override: {
    'application/json': siren
  }
});
