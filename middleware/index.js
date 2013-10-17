var formatter = require('argo-formatter');
var handlebars = require('argo-formatter-handlebars');
var gzip = require('argo-gzip');
var router = require('argo-url-router');
var siren = require('argo-formatter-siren');
var cors = require('./cors');
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
