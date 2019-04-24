let models = require( '../models/index');
const Translation = models.Translation;
const sequelize = models.sequelize;
var sub = models.redisCli

var md = require('markdown-it')({
  linkify: true,
  html:true,
});

function fetch () {
  return sequelize.query("SELECT * FROM `Translations`", { type: sequelize.QueryTypes.SELECT }).then(items => {
    return items.reduce((result, item) => {
      if (typeof result[item.lang] === 'undefined') {
        result[item.lang] = {}
      }
      result[item.lang][item.identifier] = item.phrase
      return result;
    }, {});
  })
}

module.exports = function (app) {
  // app.locals.reviews = []
  var translations = {};
  function load () {
    fetch().then(data => {
      translations = data
    })
  }
  load()

  app.locals.t = function (identifier, markdown = false, replace = {}) {
    var t = translations;
    var translation = identifier;



    var lang = app.locals.lang || 'en';

    if (typeof t[lang][identifier] !== 'undefined') {
      translation = t[lang][identifier]
    }


    // md formatting
    switch (markdown) {
      case -1:
        translation = md.renderInline(translation)
        break;
      case true:
        translation = md.render(translation)
        break;
    }

    // replace keywords
    for (var key in replace) {
      translation = translation.replace(key, replace[key])
    }

    return translation
  }


  sub.on('message', (channel, message) => {
    if (channel === Translation.REDIS_CHANNEL__UPDATE) {
      load()
    }
  });
  sub.subscribe(Translation.REDIS_CHANNEL__UPDATE);
  
}