const currencyFormatter = require("currency-formatter");

var express = require('express');
var path    = require("path");
var router = express.Router();
const cryptocurrencies = require('cryptocurrencies');
let models = require('../models');
let translations = models.Translation;
const Op = models.Sequelize.Op
const Order = models.Order
const Rate = models.Rate
const Faq = models.Faq
const Currency = models.Currency
const fs = require('fs');
var redis     = require('redis');

var availableTickers = [];

//OPTIMIZE
const COINS_DEFAULT_LIMIT = 250
const COINS_DEFAULT_SORT = ['price_usd', 'desc']


var sub;
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





router.get('/widget', (req, res, next) => {
    res.render('widget')
    // res.sendFile(path.resolve(__dirname+'/../public/widget.html'))

})


router.get('/', async (req, res, next)  => {
    sub.lrange('available_currencies', 0, -1, async function(err, reply) {
        availableTickers = reply
      let count = await Rate.count();
      res.render('index', {
          orders: [],
          count:count,
          currenciesCount:availableTickers.length
      })


    });


});


router.get('/pairs/:ticker', (req, res, next) => {


    Currency.getPromoPairs(req.params.ticker,999)
        .then(resp=>{
            res.send(resp)
        })
        .catch(e=>{
            console.log(e)
            res.send([])
        })



})



router.get('/order/:id', (req, res, next) => {


  Order.find({
    where: {
      public_id: req.params.id
    }
  }).then(order => {
    if (order) {
      res.render('exchange-summary', {
        order: order,
        host: req.get('host'),
        path: req.path
      })
    } else {
      res.status(404).send('Order not found!')
    }
  })

})

router.get('/faq', (req, res, next) => {
  res.render('faq')
});
router.get('/404', (req, res, next) => {
    res.render('404')
});
router.get('/503', (req, res, next) => {
    res.render('503')
});

router.get('/offers/:from-:to', (req, res, next) => {
  var from = req.params.from;
  var to = req.params.to;
  if (from === to) res.render('404');


  Currency.findAll({
    where: {
      ticker: {
        [Op.in]: [from, to]
      }
    }
  }).then(currencies => {

    res.locals.from = currencies.filter(el=>{
      return (el.get().ticker === from)
    });


      if (res.locals.from.length > 0){
        res.locals.from = res.locals.from[0];
      }




    res.locals.to = currencies.filter(el=>{
        return (el.get().ticker === to)
    });
    if (res.locals.to.length > 0){
        res.locals.to = res.locals.to[0];
    }

    if (!res.locals.from || !res.locals.to) {
        res.status(404).send('Pair not found')
        return
    }
    next()
  })
}, async (req, res, next) => {


    if(typeof res.locals.to.get !== 'function' || typeof res.locals.to.getName !== 'function' || typeof res.locals.from.getName !== 'function'){
        res.render('404');
    }
    var promos = await Currency.getPromoPairs(res.locals.to.get().ticker,10);
        promos = promos.filter(ticker => ticker.ticker !== res.locals.from.get().ticker && ticker.ticker !== res.locals.to.get().ticker);



    res.render('offers', {
    formData: {
      in_amount: 0.4,
      in_currency: res.locals.from.get().ticker,
      out_currency: res.locals.to.get().ticker,
        from_name:res.locals.from.getName(),
        to_name:res.locals.to.getName(),
        from_name_ticker:res.locals.from.getFullName(),
        to_name_ticker:res.locals.to.getFullName(),
        first_promo:promos[0],
        second_promo:promos[1],
        third_promo:promos[2],
        count: await Rate.count()
    },
    from: res.locals.from,
    to: res.locals.to,
    pair: req.app.locals.getPair(res.locals.from.get().ticker, res.locals.to.get().ticker),
    replace: {
      '{from}': res.locals.from.getFullName(),
      '{to}': res.locals.to.getFullName()
    }
  })
});

//method to get initial coins table
router.get('/currencies', async (req, res, next) => {
    sub.lrange('available_currencies', 0, -1, function(err, reply) {

      Currency.findAll({
        where: {
          ticker:reply
        },
        offset: 0,
        limit: COINS_DEFAULT_LIMIT,
        order: [ COINS_DEFAULT_SORT ]
      }).then((coins) => {

        var coinsIconized = coins.map(function (elem) {
            let localPath = '../public/resources/images/currencies/' + elem.ticker.toLowerCase() + '.svg';
            if (!fs.existsSync(localPath)){

                elem.dataValues.logo_src = 'no_image';
            }
            elem.price_usd = currencyFormatter.format(
                elem.dataValues.price_usd, {
                decimal:	',',
                thousand: ' ',
                precision: 2,
            });

            return elem
        });

      res.render('coins', {
          coins: coinsIconized,
          count:reply.length,
          defaultSort: COINS_DEFAULT_SORT
      })

      })


    });
});
//method to add coins to table
router.post('/currencies', async (req, res, next) => {
    sub.lrange('available_currencies', 0, -1, function(err, reply) {
      Currency.findAndCountAll({
        where: {
          [Op.or]: {
            name: {
              [Op.like]: '%' + req.body.query + '%'
            },
            ticker: {
              [Op.like]: '%' + req.body.query + '%'
            }
          },
          [Op.and]:{
            ticker:reply
          }
        },
        offset: parseInt(req.body.offset),
        limit: parseInt(req.body.limit),
        order: [ req.body.sort ? req.body.sort.split(':') : COINS_DEFAULT_SORT ]
      })
      .then((result) => {

          res.send(result)

      }).catch(err => res.status(500).send('wtf?'))

    })
});

router.get('/about', (req, res, next) => {
  res.render('about')
});

router.get('/privacy', (req, res, next) => {
  res.render('privacy')
});
router.get('/terms', (req, res, next) => {
  res.render('terms')
});


router.get('/sitemap.xml', (req, res, next) => {
    res.sendFile(path.resolve(__dirname+'/../public/sitemap.xml'))
});
router.get('/robots.txt', (req, res, next) => {
    res.sendFile(path.resolve(__dirname+'/../public/robots.txt'))
});




module.exports = router;
