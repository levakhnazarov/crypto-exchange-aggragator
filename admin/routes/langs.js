var express = require('express');
var router = express.Router();
const models = require('../../models');
const Lang = models.Lang

router.get('/', (req, res, next) => {
  Lang.findAll().then(langs => {
    res.render('langs/index', {
      langs: langs
    })  
  })
})

router.get('/add', (req, res, next) => {
  res.render('langs/form', {
    formData: {
      iso: null
    }
  })
})

router.post('/add', (req, res, next) => {
  let lang = Lang.build(req.body)
  lang.validate().then((res) => {
    lang.save().then(res => {
      next('route')
    })
  }).catch(err => {
    if (err.name === 'SequelizeValidationError') {
      res.locals.err = err
      next()
    } else {
      res.status(500).send({ error: 'Something failed!' })
    }
  })
}, (req, res, next) => {
  res.render('langs/form', {
    err: res.locals.err,
    formData: req.body
  })
})

router.post('/add', (req, res, next) => {
  res.redirect('..')
})

module.exports = router;
