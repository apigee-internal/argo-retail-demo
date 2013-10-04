var Product = require('../models/product');

module.exports = function(mapping) {
  mapping
    .of(Product)
    .at('products')
    .map('id', { to: 'name' })
    .map('name', { to: 'productname' })
    .map('image', { to: 'productimage' });
};
