module.exports = function(model) {
  var response = {};

  if (model.term) {
    response.class = ['products', 'search-results'];
    response.properties = { term: model.term };
  } else {
    response.class = ['products'];
  }

  if (model.items && model.items.length) {
    response.entities = model.items.map(function(item) {
      return {
        'class': ['product'],
        rel: ['item'],
        properties: {
          id: item.id,
          name: item.name,
          image: item.image
        },
        links: [ { rel: ['self'], href: item.selfUrl } ]
      };
    });
  }

  var searchField = {
    name: 'search',
    type: 'text'
  };
  
  if (model.term) {
    searchField.value = model.term;
  }

  response.actions = [{
    name: 'search',
    method: 'GET',
    href: model.searchUrl,
    fields: [searchField]
  }]

  response.links = [ { rel: ['self'], href: model.selfUrl } ];

  return response;
};
