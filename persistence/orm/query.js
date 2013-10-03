var Query = module.exports = function(modelConfig) {
  this.modelConfig = modelConfig;
  this.fields = [];
  this.filter = [];
};

Query.of = function(constructor) {
  var query = new Query(constructor.__orm_model_config__); 
  return query;
};

Query.prototype.select = function(fields) {
  if (!Array.isArray(fields)) {
    fields = [fields];
  }

  var self = this;
  fields.forEach(function(field) {
    field = self.modelConfig.fieldMap.hasOwnProperty(field)
              ? self.modelConfig.fieldMap[field]
              : field;

    self.fields.push(field);
  });

  return this;
};

Query.prototype.where = function(field, filter) {
  field = this.modelConfig.fieldMap.hasOwnProperty(field)
            ? this.modelConfig.fieldMap[field]
            : field;

  this.filter.push(field.toString());

  var self = this;
  Object.keys(filter).forEach(function(key) {
    if (key === 'contains') {
      self.filter.push('contains');
      self.filter.push(self.escape(filter[key]));
    }
  });

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
