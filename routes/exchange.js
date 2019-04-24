var express = require('express');
var router = express.Router();
let models = require('../models');
const Rate = models.Rate
const roundTo = require('round-to')
const Transaction = models.Transaction;
const Currency = models.Currency;
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const exchangers = require('../exchangers')
const randomID = require("random-id");


router.get('/offers-list/:from-btc', async (req, res, next) => {
  var checkChangeTo;
  if (req.params.from === "btc"){
      checkChangeTo = "eth"
  }else{
      checkChangeTo = "btc"
  }





  var from_name = await Currency.getFullNameByTicker(req.params.from);
  var to_name = await Currency.getFullNameByTicker(checkChangeTo);

  var first_promo = await Currency.getSimilarPromoByTicker(req.params.from,0);
  var second_promo = await Currency.getSimilarPromoByTicker(req.params.from,1);
  var third_promo = await Currency.getSimilarPromoByTicker(req.params.from,2);
  var count = await Currency.count()


    await res.render('offers-list',
        {
          formData:
            {
              "exchanger":"changelly",
                "in_amount":"5",
                "in_currency":req.params.from,
                "out_currency":checkChangeTo,
                "from_name":from_name,
                "to_name":to_name,
                "first_promo":first_promo,
                "second_promo":second_promo,
                "third_promo":third_promo,
                "count":count
            }
        },
    )
.catch((err) => {
    console.log(err)
});

})

router.get('/offers', (req, res, next) => {
    res.render('exchange-offers')
})

router.post('/offers', async (req, res, next) => {


    var response = req.body
    response.in_currency_name = await Currency.getNameByTicker(req.body.in_currency)
    response.out_currency_name = await Currency.getNameByTicker(req.body.out_currency)
    res.render('exchange-offers', {
        formData: response
    })
});

router.get('/:exchanger/:from-:to', (req, res, next) => {


    let exchangersArray = ['poloniex','kucoin', 'huobi']


    if(exchangersArray.includes(req.params.exchanger)){
        res.redirect('503')
    }


    Rate.find({where: {
    currency_from: req.params.from,
    currency_to: req.params.to,
    exchanger: req.params.exchanger,
    }}).then(async rate => {
    res.render('exchange-details', {
      formData: {
        in_currency: req.params.from,
        out_currency: req.params.to,
        in_amount: roundTo.up(Number(rate.min_amount), 6),
        exchanger: req.params.exchanger,
        pairs_count: await Rate.count()
      }
    })
    })
  
})

router.post('/:exchanger/:from-:to', async (req, res, next) => {



    let exchangersArray = ['kucoin','huobi','poloniex'];
    // let exchangersArray = []
    if(exchangersArray.includes(req.params.exchanger)){
        res.render('503')
    }

    let response = req.body;
        response.in_currency_tag = await Currency.hasAdditionalField(req.body.in_currency);
        response.out_currency_tag = await Currency.hasAdditionalField(req.body.out_currency);
        response.pairs_count = await Rate.count();
    res.render('exchange-details', {
        formData: response
    })
});

function offers (req, res, next) {
  res.render('offers', {
    form: req.method == 'POST' ? req.body : null
  })
}

router.post('/offers', offers)
router.get('/offers', offers)

// details
router.all('/:exchanger/:from-:to', (req, res, next) => {

    let exchangersArray = ['poloniex','kucoin']


    if(exchangersArray.includes(req.params.exchanger)){
        res.redirect('503')
    }

  Rate
  .offersByExchanger(req.params.exchanger)
  .then(rates => {
    res.rates = rates
    next()
  })
})
router.post('/:exchanger/:from-:to', [
  check(['from', 'to', 'exchanger', 'address']).exists().isLength({ min: 1 })
  // check(['from', 'to', 'exchanger', 'address']).notEmpty()
])
router.all('/:exchanger/:from-:to', async (req, res, next) => {
  var referer = req.header('Referer')
  var selfRef = referer ? referer.search(
    req.params.exchanger + '/'
    + req.params.from + '-'
    + req.params.to
  ) : -1
  var errors
  if (req.method == 'POST' && selfRef !== -1) {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
    } else {
      var data = req.body
      data.from = req.params.from
      data.to = req.params.to
      data.amount = data.val_from
      // var transaction = new Transaction()
      // transaction.input_currency = req.body.from
      // transaction.output_currency = req.body.to
      // transaction.ouput_address = req.body.address
      var bestRate = res.rates.filter(r => r.from == data.from && r.to == data.to)[0]
      await exchangers[req.params.exchanger]
        .send(data.from, data.to, data.amount, data.address)
        .then(async response => {
          let col = {
            outer_id: response.id,
            inner_id: randomID(5, '0') + '-' + randomID(2, '0'),

            exchanger: req.params.exchanger,

            input_currency: data.from,
            output_currency: data.to,

            input_amount: data.amount,
            output_amount: (bestRate.rate * data.amount / 1),

            input_address: response.address,
            input_address_ext: response.address_ext,

            output_address: data.address,
            output_address_ext: '',
            status: 1
           };

          await Transaction.create(col).then(transaction => {
              res.redirect('/track/' + transaction.inner_id)
          })
        })
    }
  }
  res.render('details', {
    ref: req.header('Referer'),
    errors: typeof errors !== 'undefined' ? errors.mapped() : null,
    rates: res.rates ? res.rates : res.locals.rates,
    form: req.method == 'POST' ? req.body : null
  })
})




module.exports = router;
