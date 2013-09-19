var argo = require('argo');
var gzip = require('argo-gzip');
var router = require('argo-url-router');
var resource = require('argo-resource');

var Products = require('./products');

var port = process.env.PORT || 3000;

argo()
  .use(gzip)
  .use(router)
  .use(resource(Products))
  .listen(port);
