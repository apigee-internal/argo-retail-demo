var Product = require('../../models/product');

module.exports = function(config) {
  config
    .of(Product)
    .at('products')
    .map('id', { to: 'name' })
    .map('name', { to: 'productname' })
    .map('image', { to: 'productimage' });
};
