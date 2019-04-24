let models = require( '../models/index');
const Rate = models.Rate;
var sub = models.redisCli;

const EventEmitter = require('events')

class RatesCache extends EventEmitter {
  
  constructor () {
    super()
    this.list = []
    this.fetch()
    sub.on("message", (channel, message) => {
      switch (channel) {
        case 'rates-update':
          console.log("rates fetch")
          this.fetch()
          break;
      }
    });
    sub.subscribe("rates-update");
  }

  getList () {
    return this.list
  }

  fetch() {
    Rate
      .bestRates()
      .then(items => {
        this.list = items
        this.emit('update', this.list)
      })
      .catch(err => console.log(err))
  }
}

module.exports = RatesCache