var changelly = require('./exchangers/lib/changelly');
var io = require('socket.io')(process.env.PORT)
const models = require('./models')
const Order = models.Order;
const redis     = require('redis');
//TODO перенести в worker changelly
var api = new changelly( "db7b195d64a245bdab9e3b1214053c3e", "5b34f68b3aa6c42cde38559586d5dfbf8673973a3ee5fb58ca031f8bdbfc92e4" );


api.on("payin", function(data) {

  Order.getByApiId(data.id)
      .then(order=>{
        if(data.status !== "sending" && data.status !== "finished"){
          order.progress = 1;
          order.save();
        }
      })
      .catch(err => console.log(err))

});
api.on("status", function(data) {

    console.log(data)
    Order.getByApiId(data.id)
        .then(order=>{
            if(data.status === "sending"){
              order.progress = 2;
              order.save();
            }
            if(data.status === "finished"){
              order.progress = 3;
              order.save();
            }

        })
        .catch(err => console.log(err))


    console.log("status");
    console.log(data);
});

// api.on("payout", function(data) {
//
//   console.log(data)
//   Order.getByApiId(data.id)
//       .then(order=>{
//           order.progress = 2;
//           order.save();
//       })
//       .catch(err => console.log(err))
// });



io.on('connection', function (socket) {



  var sub =  redis.createClient();




  var channels = {
    'rates-update': function () {
      console.log('rates-update emitting from socket')
      io.emit('rates-update')
    }
  }

  sub.on("message", (channel, message) => {
    console.log("message received",channel, message)


    if (typeof channels[channel] !== 'undefined') {
      channels[channel](message)
    }
  })
  sub.subscribe('rates-update')

  socket.on('order', function (id) {
    sub.subscribe('order:' + id)

    console.log('order:' + id);

    channels['order:' + id] = function (step) {
      io.emit('order:' + id, step)
    }
  })




  socket.on('transactions', function () {
    sub.subscribe('transaction')



    console.log('transaction')
    channels['transaction'] = function (id) {
      console.log(id, ' ...of transactions');



      Order.findById(id).then(function (order) {
        io.emit('transaction', {
          in: order.payin_currency,
          out: order.payout_currency,
          amount: order.payInAmount(),
          saved: order.getSaved()
        })
      })
      
    }
  })

  socket.on('rates', function () {
    sub.subscribe('rates-update')
  })

  socket.on('disconnect', function () {
    sub.unsubscribe()
    sub.quit()
  });


  
})