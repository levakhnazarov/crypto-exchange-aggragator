let models = require( '../models/index');
const sequelize = models.sequelize;
const Review = models.Review;
const sub = models.redisCli;


function fetch() {
  return Review.list()
}

module.exports = function (app) {
  app.locals.reviews = []

  function load () {
    fetch().then(reviews => {
      app.locals.reviews = reviews
    })
  }
  load()

  sub.on('message', (channel, message) => {
    if (channel === Review.REDIS_CHANNEL__UPDATE_REVIEWS) {
      load()
    }
  });
  sub.subscribe(Review.REDIS_CHANNEL__UPDATE_REVIEWS);
  
}