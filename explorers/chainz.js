const models = require('../models');
const Rate = models.Rate;
const Order = models.Order;
const exchanger = 'alpha';
const roundTo = require('round-to');
var http = require('http');

module.exports.send = function (from, to, amount, address, address_ext) {
  return new Promise(function(resolve, reject) {
    var options = {
      hostname: 'localhost',
      port: 7000,
      path: '/api/order',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    var req = http.request(options, function(res) {
      console.log('Status: ' + res.statusCode);
      // console.log('Headers: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (body) {
        var data = JSON.parse(body);
        // resolve({
        //   id: data.id,
        //   address: 'beta-address',
        //   address_ext: null
        // })

        Rate.singlePairOffers(from, to, exchanger)
          .then((rates) => {
            var rate = rates[0];

            Order.create({
              api_id: data.id,
              public_id: randomID(5, '0') + '-' + randomID(2, '0'),
              exchanger: exchanger, 
              payin_currency: from, 
              payout_currency: to, 
              rate: rate.rate, 
              payin_amount: amount, 
              payin_amount_min: roundTo(Number(rate.min), 6), 
              payout_amount: roundTo(Number(amount) * Number(rate.rate), 6), 
              saved_pct: 5,

              payin_address: 'payin_address',
              payin_address_ext: 'payin_address_ext',

              payout_address: address,
              payout_address_ext: address_ext,

              refund_address: address_ext,
              refund_address_ext: address_ext,
              progress: 0,
              error: 0
            }).then(order => {
              resolve(order)
            }).catch(err => reject(err))
          })
          .catch(err => reject(err))

      });
    });
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      reject(e)
    });
    // write data to request body
    req.write(JSON.stringify({
      from: from,
      to: to,
      amount: amount,
      address: address
    }));
    req.end();
  })
}