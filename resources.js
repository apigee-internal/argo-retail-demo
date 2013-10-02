var resource = require('argo-resource');

var Products = require('./resources/products');
var ProductsRepository = require('./data/products_repository');

exports.products = resource(Products, new ProductsRepository());

