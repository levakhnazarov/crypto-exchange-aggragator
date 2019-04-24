let models = require( '../models/index');
const Currency = models.Currency;
var sub = models.redisCli


const EventEmitter = require('events')

class CurrenciesCache extends EventEmitter {
  
  constructor () {
    super()
    this.list = []
    this.fetch()
    sub.on("message", (channel, message) => {
      switch (channel) {
        case 'currencies-update':
          this.fetch()
          break;
      }
    });
    sub.subscribe("currencies-update");
  }

  getList () {
    return this.list
  }

  fetch() {
    Currency
      .findAll()
      .then(models => {
        this.list = models
        this.emit('update', this.list)
      })
      .catch(err => console.log(err))
  }
}

module.exports = CurrenciesCache