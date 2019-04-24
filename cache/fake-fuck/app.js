var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.title = process.env.NAME
app.get('/', function (req, res) {
  res.render('index', {
    name: process.env.NAME
  })
});



/**
 * Currencies
 */

var currencies = [
  {abbr: 'BTC', name: 'Bitcoin'},
  {abbr: 'ETH', name: 'Ethereum'},
  {abbr: 'XRP', name: 'Ripple'},
  {abbr: 'BCH', name: 'Bitcoin Cash'},
  {abbr: 'LTC', name: 'Litecoin'},
  {abbr: 'EOS', name: 'EOS'},
  {abbr: 'ADA', name: 'Cardano'},
  {abbr: 'XLM', name: 'Stellar'},
  {abbr: 'NEO', name: 'Neo'},
  {abbr: 'MIOTA', name: 'IOTA'},
  {abbr: 'XMR', name: 'Monero'},
  {abbr: 'DASH', name: 'Dash'},
  {abbr: 'USDT', name: 'Tether'},
  {abbr: 'TRX', name: 'TRON'},
  {abbr: 'XEM', name: 'NEM'},
  {abbr: 'ETC', name: 'Ethereum Classic'}
]
app.get('/currencies', function (req, res) {
  res.render('currencies/index', {
    list: currencies
  })
})
app.get('/api/currencies', function (req, res) {
  res.send(currencies)
})

// create
app.get('/currencies/create', function (req, res) {
  res.render('currencies/form', {
    item: {
      name: null,
      abbr: null
    }
  })
})
app.post('/currencies/create', function (req, res) {
  currencies.push(req.body)
  res.redirect('/currencies')
})

// delete
app.get('/currencies/delete/:id', function (req, res) {
  currencies.splice(parseInt(req.params.id), 1)
  res.redirect('/currencies')
})

/**
 * Rates
 */

var rates = [
  {from: "BTC", to: "ETH", rate: 17, min: 0.01, max: 2},
  {from: "ETH", to: "BTC", rate: 0.05, min: 0.18, max: 20}
  // {from: "BTC", to: "ETH", rate: 10},
  // {from: "ETH", to: "BTC", rate: 0.01},

  // {from: "BTC", to: "LTC", rate: 1000},
  // {from: "LTC", to: "BTC", rate: 0.001},

  // {from: "ETH", to: "LTC", rate: 500},
  // {from: "LTC", to: "ETH", rate: 0.0005}
]
app.get('/rates', function (req, res) {
  res.render('rates/index', {
    list: rates
  })
})
app.get('/api/rates', function (req, res) {
  res.send(rates)
})

// create
app.get('/rates/create', function (req, res) {
  res.render('rates/form', {
    currencies: currencies,
    item: {
      from: null,
      to: null,
      rate: null,
      min: null,
      max: null
    }
  })
})
app.post('/rates/create', function (req, res) {
  var data = req.body
  if (data.from === data.to || data.min > data.max) {
    return res.render('rates/form', {
      currencies: currencies,
      item: data
    })
  }

  var exist = rates.findIndex((rate, index) => {
    if (rate.from == data.from && rate.to == data.to) {
      return true
    }
    return false
  })
  if (exist !== -1) {
    rates[exist] = data
  } else {
    rates.push(req.body)  
  }
  res.redirect('/rates')
})

// create
app.get('/rates/update/:id', function (req, res) {
  res.render('rates/form', {
    currencies: currencies,
    item: rates[parseInt(req.params.id)]
  })
})
app.post('/rates/update/:id', function (req, res) {
  rates[parseInt(req.params.id)] = req.body
  res.redirect('/rates')
})

// delete
app.get('/rates/delete/:id', function (req, res) {
  rates.splice(parseInt(req.params.id), 1)
  res.redirect('/rates')
})


/**
 * Transactions
 */
const randomID = require("random-id");

const STATUS_NEW = 0
// const STATUS_ACCEPT = 2
const STATUS_EXCHANGE = 1
const STATUS_SEND = 2
const STATUS_DONE = 3

const STATUS_FAIL = -1

const STATUS_LABELS = {
  [STATUS_NEW]: 'New',
  // [STATUS_ACCEPT]: 'Accept',
  [STATUS_EXCHANGE]: 'Exchange',
  [STATUS_SEND]: 'Send',
  [STATUS_DONE]: 'Done',
  [STATUS_FAIL]: 'Fail'
}

var orders = [
  {id: randomID(16), from: "BTC", to: "ETH", amount: 0.5, status: STATUS_NEW, dt: new Date()},
  // {id: randomID(16), from: "LTC", to: "ETH", amount: 10, status: STATUS_ACCEPT, dt: new Date()}
]
app.get('/orders', function (req, res) {
  res.render('orders/index', {
    statuses: STATUS_LABELS,
    list: orders.sort((a, b) => b.dt - a.dt)
  })
})

app.get('/orders/status/:id/:status', function (req, res) {
  orders[parseInt(req.params.id)].status = parseInt(req.params.status)
  res.redirect('/orders')
})

app.post('/api/order', function (req, res) {
  var data = Object.assign({}, req.body)
  data.id = randomID(16)
  data.dt = new Date()
  data.status = STATUS_NEW
  orders.push(data)
  res.send(data)
})
app.get('/api/order/:id', function (req, res) {
  var data = orders.reduce((data, item) => {
    if (item.id == req.params.id) {
      data = item
    }
    return data
  }, false)
  if (data) {
    res.send(data)
  } else {
    res.status(404).send('Not found')
  }
  
})

// // create
// app.get('/rates/create', function (req, res) {
//   res.render('rates/form', {
//     currencies: currencies,
//     item: {
//       from: null,
//       to: null,
//       rate: null
//     }
//   })
// })
// app.post('/rates/create', function (req, res) {
//   rates.push(req.body)
//   res.redirect('/rates')
// })

// // create
// app.get('/rates/update/:id', function (req, res) {
//   res.render('rates/form', {
//     currencies: currencies,
//     item: rates[parseInt(req.params.id)]
//   })
// })
// app.post('/rates/update/:id', function (req, res) {
//   rates[parseInt(req.params.id)] = req.body
//   res.redirect('/rates')
// })

// // delete
// app.get('/rates/delete/:id', function (req, res) {
//   rates.splice(parseInt(req.params.id), 1)
//   res.redirect('/rates')
// })


app.listen(process.env.PORT, function () {
  console.log('Fake exchanger [' + process.env.NAME + '] listening on port ' + process.env.PORT + '!');
});