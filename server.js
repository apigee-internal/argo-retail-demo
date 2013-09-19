var argo = require('argo');
var gzip = require('argo-gzip');
var router = require('argo-url-router');
var resource = require('argo-resource');

var Products = require('./products');

argo()
  .use(gzip)
  .use(router)
  .use(resource(Products))
  .listen(3000);
