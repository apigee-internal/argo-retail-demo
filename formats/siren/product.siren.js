module.exports = function(model) {
  return {
    'class': ['product'],
    properties: {
      id: model.id,
      name: model.name,
      image: model.image
    },
    links: [
      { rel: ['self'], href: model.selfUrl }, 
      { rel: ['collection'], href: model.collectionUrl }
    ]
  };
};
