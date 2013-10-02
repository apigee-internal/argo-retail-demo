exports.domain = {
  Product: require('./models/domain/product')
};

exports.response = {
  Product: require('./models/response/product'),
  ProductList: require('./models/response/product_list'),
  ProductListItem: require('./models/response/product_list_item')
};
