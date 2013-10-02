var Product = module.exports = function(id, name, image) {
  this.id = id;
  this.name = name;
  this.image = image;
};

Product.create = function(id, name, image) {
  return new Product(id, name, image);
};
