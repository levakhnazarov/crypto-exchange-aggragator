var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index')
})

router.post('/', (req, res, next) => {
  console.log(req.body)
  res.render('index', {
    fd: req.body
  })
})

module.exports = router;
