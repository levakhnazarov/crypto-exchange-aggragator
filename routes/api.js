var express = require('express');
var router = express.Router();
const models = require('../models');
const Currency = models.Currency
const Rates = models.Rate;
const exchangers = require('../exchangers');
const explorers= require('../explorers');
var QRCode = require("qrcode-svg");
const sendmail = require('sendmail')();
const FileUtil = require('../helpers/utils-module').file;
var redis     = require('redis');


var availableTickers, sub;
if (process.env.REDISTOGO_URL) {
    let rtg   = require("url").parse(process.env.REDISTOGO_URL);
    sub = redis.createClient(rtg.port, rtg.hostname);
    sub.auth(rtg.auth.split(":")[1]);

    sub = redis.createClient(rtg.port, rtg.hostname);
    sub.auth(rtg.auth.split(":")[1]);

} else {
    // sub = redis.createClient(6379, 'redis');
    sub = redis.createClient();
}

// sub.lrange('available_currencies', 0, -1, function(err, reply) {
//     availableTickers = reply
// });





router.get('/exchange/currencies', (req, res, next) => {
    sub.lrange('coin_base', 0, -1, function(err, reply) {

        var coins = []
        for (let i in reply){
            coins.push(JSON.parse(reply[i]))
        }
        res.send(coins)

    });

})

router.get('/exchange/pairs', (req, res, next) => {
  Rates.pairs().then((result) => res.send(result))
})
router.get('/sendOrderEmail', async (req, res, next) => {


    sendmail({
        from: 'hello@smartjex.com',
        to: req.query.email,
        subject: 'exchange order link',
        html: 'You can track exchange transaction status by the link: ' + req.query.order_url,
    }, function(err, reply) {

        console.dir(reply);
        res.redirect(req.query.path);
    });
})
router.get('/sendAboutEmail', async (req, res, next) => {


    sendmail({
        from: req.query.email,
        to: 'hello@smartjex.com',
        // to: 'levakhnazarov@gmail.com',
        subject: req.query.subject,
        html: req.query.text,
    }, function(err, reply) {
        res.redirect(req.get('referer'));
        console.dir(reply);

    });
})


router.get('/exchange/order', async (req, res, next) => {

    if (typeof req.query.exchanger !== 'undefined') {

        exchangers.getOrderStep(req.query.exchanger, req.query.order)
            .then(resp=>{
                res.send(resp)

            })
            .catch(err=>{
                console.log(err)
            })


    }

})

// обновление рэйта в случае отсутствия обновления за последние 15 минут
router.get('/exchange/offers', async (req, res, next) => {
    let result = await Rates.singlePairOffers(req.query.from, req.query.to, req.query.exchanger);
        if (typeof req.query.exchanger !== 'undefined') {
            res.send(result)
        }else{
            let count = await Rates.singlePairOffersCount(req.query.from, req.query.to);

                // console.log(count)
                // console.log(result)

                if (result.length === count){ res.send(result) }else{
                exchangers.updateRatesForPairs(req.query.from, req.query.to, req.query.exchanger)
                    .then(resp=> res.send(resp))
                    .catch(err=> console.log(err))

                }

        }



})

router.post('/exchange', (req, res, next) => {

  var data = req.body, service = data.exchanger;

  // let notReady = ['poloniex', 'bittrex','huobi','kucoin'];
  //
  // if(notReady.indexOf(service) > -1){
  //     res.send('Something broke!');
  // }

  if (typeof exchangers.components[service] !== 'undefined') {
    let send = exchangers.components[service].send;

    send(data.in_currency, data.out_currency, data.payout_address,
        data.in_amount, data.out_amount, data.refund_address, data.saved, data.refund_address_ext, data.payout_address_ext )
      .then(order => {
        let filepath = "/../../../public/img/orders/"+order.public_id+".svg";

        var svg = new QRCode(order.payin_address).svg();
          FileUtil.createFile(filepath, svg).then(
              res.send({ url: order.getUrl() })
          )

        // pub.publish('transaction', order.id);
      })
      .catch(err => {
        console.log(err);
        res.send('Something broke!');
      });
  } else {
    res.send('Exchanger '+service+' not found!')
  }
});


router.get('/updateExplorers', async (req, res, next) => {


    let epd = await explorers.updateCoinExplorers();

    res.send(epd);

})


module.exports = router