var express = require('express');
var router = express.Router();
let models = require( '../models');
const Rate = models.Rate;

router.post('/', (req, res, next) => {
  Rate
    .offersByPair(req.body.from, req.body.to)
    .then(models => res.send(models))
  // .catch(err => new Error(err))
})


module.exports = router;
