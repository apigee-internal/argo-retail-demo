var argo = require('argo');
var gzip = require('argo-gzip');
var router = require('argo-url-router');
var resource = require('argo-resource');
var cors = require('./middleware/cors');
var mustache = require('./middleware/mustache');
var parser = require('./middleware/parser');

var engine = mustache();

var Products = require('./resources/products');

var port = process.env.PORT || 3000;

argo()
  .use(cors)
  .use(gzip)
  .use(router)
  .use(engine)
  .use(parser)
  .use(resource(Products))
  .listen(port);
