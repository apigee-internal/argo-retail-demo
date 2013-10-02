var argo = require('argo');
var gzip = require('argo-gzip');
var resource = require('argo-resource');
var router = require('argo-url-router');
var cors = require('./middleware/cors');
var siren = require('./middleware/siren');
var Products = require('./resources/products');
var ProductsRepository = require('./data/products_repository');

var engine = siren();
var port = process.env.PORT || 3000;

argo()
  .use(cors)
  .use(gzip)
  .use(router)
  .use(engine)
  .use(resource(Products, new ProductsRepository()))
  .listen(port);
