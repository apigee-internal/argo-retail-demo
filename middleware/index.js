var gzip = require('argo-gzip');
var router = require('argo-url-router');
var cors = require('./cors');
var url = require('./url');

exports.cors = cors;
exports.gzip = gzip;
exports.router = router;
exports.url = url;
