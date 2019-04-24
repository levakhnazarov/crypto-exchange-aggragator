var express = require('express');
var router = express.Router();
const models = require('../../models');
const Review = models.Review;




if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var pub = require("redis").createClient(rtg.port, rtg.hostname);

    pub.auth(rtg.auth.split(":")[1]);
} else {
    var pub = require("redis").createClient();
}


router.get('/', (req, res, next) => {
  Review.list().then(items => {
    res.render('reviews/index', {
      items: items
    });
  });
});

router.get('/add', (req, res, next) => {
  res.render('reviews/form', {
    formData: {
      url: null,
      author: null,
      comment: null,
      post_date: null
    }
  });
});

router.post('/add', (req, res, next) => {
  let model = Review.build(req.body)
  model.validate().then((res) => {
    model.save().then(res => {
      next('route');
    });
  }).catch(err => {
    if (err.name === 'SequelizeValidationError') {
      res.locals.err = err;
      next();
    } else {
      res.status(500).send({ error: 'Something failed!' })
    }
  })
}, (req, res, next) => {
  res.render('reviews/form', {
    err: res.locals.err,
    formData: req.body
  });
})

router.post('/add', (req, res, next) => {
  pub.publish(Review.REDIS_CHANNEL__UPDATE_REVIEWS, true);
  res.redirect('/reviews');
});

router.get('/:id', (req, res, next) => {
  Review.findById(req.params.id).then(review => {
    res.render('reviews/form', {
      formData: review
    });
  }).catch(err => res.status(404).send('Review not found'));
});

router.post('/:id', async (req, res, next) => {
  // let model = Review.build(req.body)

  let model = await Review.findById(req.params.id);
  model.set(req.body);
  model.validate().then((res) => {
    model.save().then(res => {
      next('route');
    });
  }).catch(err => {
    if (err.name === 'SequelizeValidationError') {
      res.locals.err = err;
      next();
    } else {
      res.status(500).send({ error: 'Something failed!' })
    }
  })
}, (req, res, next) => {
  res.render('reviews/form', {
    err: res.locals.err,
    formData: req.body
  });
})

router.post('/:id', (req, res, next) => {
  pub.publish(Review.REDIS_CHANNEL__UPDATE_REVIEWS, true);
  res.redirect('/reviews');
});

router.get('/delete/:id', (req, res, next) => {
  Review.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    pub.publish(Review.REDIS_CHANNEL__UPDATE_REVIEWS, true);
    res.redirect('/reviews'); 
  }).catch(e => res.status(500).send({ error: 'Something failed!' }));
});

module.exports = router;
