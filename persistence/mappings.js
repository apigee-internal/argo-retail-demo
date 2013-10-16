var Product = require('../models/product');

var companyMapping = function(mapping) {
  mapping
    .of(Product)
    .at('products')
    .map('id', { to: 'name' })
    .map('name', { to: 'productname' })
    .map('image', { to: 'productimage' });
};

module.exports = [companyMapping];
