let models = require( '../models/index');
const sequelize = models.sequelize;

const EventEmitter = require('events')
var md = require('markdown-it')({
  linkify: true
});

class Translations extends EventEmitter {
  
  constructor () {
    super()
    this.list = []
    this.lang = 'en'
    this.fetch()
    // sub.on("message", (channel, message) => {
    //   switch (channel) {
    //     case 'currencies-update':
    //       this.fetch()
    //       break;
    //   }
    // });
    // sub.subscribe("currencies-update");
  }

  setLang (lang) {
    this.lang = 'en'
  }

  getList () {
    return this.translations
  }

  translate (identifier, markdown = false, replace = {}) {
    var t = this.translations;
    var translation = identifier
    if (typeof t[this.lang][identifier] !== 'undefined') {
      translation = t[this.lang][identifier]
    } else if (typeof t.en[identifier] !== 'undefined') {
      translation = t.en[identifier]
    }
    
    switch (markdown) {
      case -1:
        translation = md.renderInline(translation)
      case true:
        translation = md.render(translation)
    }
    for (var key in replace) {
      translation = translation.replace(key, replace[key])
    }
    return translation
  }

  fetch() {
    sequelize.query("SELECT * FROM `Translations`", { type: sequelize.QueryTypes.SELECT }).then(items => {
      this.translations = items.reduce((result, item) => {
        if (typeof result[item.lang] === 'undefined') {
          result[item.lang] = {}
        }
        result[item.lang][item.identifier] = item.phrase
        // result[item.lang][item.identifier] = item.phrase;
        return result;
      }, {});
      // console.log(this.translations)
    })
  }
}

module.exports = Translations