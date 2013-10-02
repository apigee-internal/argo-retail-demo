var resource = require('argo-resource');

var Products = require('./products');
var ProductsRepository = require('../persistence/products_repository');

exports.products = resource(Products, new ProductsRepository());

