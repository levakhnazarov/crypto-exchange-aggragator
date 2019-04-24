let models = require( '../models');
const Pair = models.Pair;
const sub = models.redisCli;


function fetch() {
  return Pair.findAll()
}

module.exports = function (app) {

  var pairs = []
  function load () {
    fetch().then(items => {
      pairs = items
    })
  }
  load()

  sub.on('message', (channel, message) => {
    if (channel === Pair.REDIS_CHANNEL__UPDATE) {
      load()
    }
  });
  sub.subscribe(Pair.REDIS_CHANNEL__UPDATE);

  app.locals.getPair = function (from, to) {
    var items = pairs
      .filter(item => item.checkMatch(from, to))
      .sort((a, b) => b.checkMatch(from, to) - a.checkMatch(from, to))
    if (items.length > 0) {
      return items[0]
    }
    return null
  }
}