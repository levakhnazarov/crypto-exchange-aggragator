var express = require('express');
var router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const Translation = models.Translation

router.get('/:prefix', (req, res, next) => {
  var prefix = req.params.prefix.toUpperCase()
  Translation.getMeta(prefix).then(items => {
    res.render('meta/form', {
      items: items,
      prefix: prefix,
      success: null
    })
  }).catch(err => res.status(500).send({ error: 'Something failed!' }))
})

router.post('/:prefix', (req, res, next) => {
  var prefix = req.params.prefix.toUpperCase()
  Translation.setMeta(prefix, req.body).then(items => {
    res.render('meta/form', {
      items: items,
      prefix: prefix,
      success: true
    })
  }).catch(err => {
    res.status(500).send({ error: 'Something failed!' })
  })
})

module.exports = router;
