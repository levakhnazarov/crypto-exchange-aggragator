let models = require( '../models');
const Faq = models.Faq;
const sub = models.redisCli;


function fetch() {
  return Faq.list()
}

module.exports = function (app) {
  app.locals.faq = {
    qa: [],
    sections: Faq.SECTIONS_TRNASLATION_ID
  };
  function load () {
    fetch().then(faq => {
      app.locals.faq.qa = faq
    })
  }
  load()

  sub.on('message', (channel, message) => {
    if (channel === Faq.REDIS_CHANNEL__UPDATE) {
      load()
    }
  });
  sub.subscribe(Faq.REDIS_CHANNEL__UPDATE);
}