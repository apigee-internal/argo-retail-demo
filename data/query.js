var Query = module.exports = function(map) {
  this.current = null;
  this.fields = [];
  this.filter = [];
  this.map = map || {};
};

Query.create = function(map) {
  return new Query(map);
};

Query.prototype.select = function(fields) {
  if (!Array.isArray(fields)) {
    fields = [fields];
  }

  var self = this;
  fields.forEach(function(field) {
    field = self.map.hasOwnProperty(field) ? self.map[field] : field;
    self.fields.push(field);
  });

  return this;
};

Query.prototype.where = function(field) {
  field = this.map.hasOwnProperty(field) ? this.map[field] : field;

  this.filter.push(field.toString());

  return this;
};

Query.prototype.contains = function(value) {
  value = this.escape(value);

  this.filter.push('contains');
  this.filter.push(value);

  return this;
};

Query.prototype.toString = function() {
  var selectString = this.fields.length
    ? this.fields.join(', ')
    : '*';

  var filterString = this.filter.join(' ');

  var query = 'select ' + selectString;

  if (filterString.length) {
    query += ' where ' + filterString;
  }

  return query;
};

Query.prototype.escape = function(value) {
  var val = value;

  if (!val) {
    return '';
  }

  var type = typeof val;

  if (type === 'number') {
    val = val.toString();
  }

  val = val
    .replace(/\x00/g, '\0')
    .replace(/\x08/g, '\b')
    .replace(/\x09/g, '\t')
    .replace(/\x0a/g, '\n')
    .replace(/\x0d/g, '\r')
    .replace(/\x1a/g, '\Z')
    .replace(/\x22/g, '\"')
    .replace(/\x25/g, '\%')
    .replace(/\x27/g, '\\\'')
    .replace(/\x5c/g, '\\')
    .replace(/\x5f/g, '\_')

  if (type === 'string') {
    val = '\'' + val + '\'';
  }

  return val;
};
