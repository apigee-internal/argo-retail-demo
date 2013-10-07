var ProductList = module.exports = function() {
  this.items = null;
  this.term = null;
  this.searchUrl = null;
  this.selfUrl = null;
};

ProductList.create = function(fill) {
  fill = fill || {};

  var list = new ProductList();

  list.items = fill.items;
  list.term = fill.term;
  list.searchUrl = fill.searchUrl;
  list.selfUrl = fill.selfUrl;

  return list;
};
