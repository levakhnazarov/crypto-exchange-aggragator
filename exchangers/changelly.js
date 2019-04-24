var changelly = require('./lib/changelly');
const strict = require('../helpers/utils-module/lib/strict')
const { Op } = require('sequelize')
const models = require('../models');
const Rate = models.Rate;
const Order = models.Order;
const exchanger = 'alpha';
const http = require('http');
const roundTo = require('round-to');
const randomID = require("random-id");
const crypto = require("crypto");
var socket = require('socket.io')

var that = {
    name:"changelly"
}

that.api = new changelly( models.conf.api.changelly.apiKey, models.conf.api.changelly.secret );
// that.api.on("connect", function() {
//     that.api.emit("subscribe",
//         {
//             "apiKey": models.conf.api.changelly.apiKey,
//             "sign": models.conf.api.changelly.secret,
//             "message": {
//                 "Login": {}
//             }
//         }
//     );
// });


that.getCurrencies = function(){
    return new Promise(function(resolve, reject) {
        if(typeof that.api.getCurrencies !=="undefined" && typeof that.api.getCurrencies ==="function"){
            that.api.getCurrencies(function (err, data) {
                if (err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        }else{
            reject("can't find method")
        }
    })
};

that.checkOrUpdateOrderStep = function (orderId) {
    return new Promise(async function(resolve, reject) {
        var order = await models.Order.getByPublicId(orderId)
            resolve({ status:order.progress })
    })
}


that.getStatus = function(transactionId){
    return new Promise(function(resolve, reject) {
        if(typeof that.api.getStatus !=="undefined" && typeof that.api.getStatus ==="function"){
            that.api.getStatus(transactionId, function (err, data) {
                if (err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        }else{
            reject("can't find method")
        }
    })
};

// that.checkOrUpdateOrderStep = function (orderId) {
//     return new Promise(async function(resolve, reject) {
//         var order = await models.Order.getByPublicId(orderId)
//
//         var status = await that.getStatus(order.api_id)
//
//         that.api.getTransactions(999, 0, "bch", "0x30bbcd53c587044f135c1c972b670a31b943ced5", null, function(err, data){
//             if (err) console.log(err)
//
//             console.log(data)
//             console.log(status)
//
//
//         resolve(status)
//
//         })
//
//
//     })
// }

that.getRatesForPair = function(from, to) {
    return new Promise(async function(resolve, reject) {

        that.api.getCurrencies(async function (err, currencies) {
            if (err) resolve(false);
            let excluded = false;
            // console.log(typeof currencies.result )
            if(!currencies.hasOwnProperty("result") || typeof currencies.result === "undefined"){
                resolve(false);
                return
            }

            if (currencies.result.indexOf(from) === -1){
                excluded = true;
                await Rate.destroy({where: {exchanger: that.name, [Op.or]:[{currency_from: from}, { currency_to: from}]}})
                    .then(res=>resolve(false))
            }
            if (currencies.result.indexOf(to) === -1){
                excluded = true;
                await Rate.destroy({where: {exchanger: that.name, [Op.or]:[{currency_from: to},{ currency_to: to}]}})
                    .then(res=>resolve(false))
            }


        let minAmount = await that.getMinAmount(from, to);

            let foundFromDatabase = await Rate.find({where: {exchanger: that.name, currency_from: from, currency_to: to}});



        let exchangedAmount = (from === "btc") ? "0.02" : minAmount.result;
        // let exchangeAmount = await that.getExchangeAmount(from, to, exchangedAmount);
        let exchangeAmount = await that.getExchangeAmount(from, to, exchangedAmount);

            if(foundFromDatabase ){
                foundFromDatabase.min_amount = minAmount.result;
                foundFromDatabase.rate = exchangeAmount.result / exchangedAmount;
                foundFromDatabase.save().then(res=>{

                    resolve(res)

                })


            }else if(!excluded){

                    Rate.create({
                    exchanger: that.name,
                    currency_from: from,
                    currency_to: to,
                    min_amount: minAmount.result,
                    rate: exchangeAmount.result / exchangedAmount,
                }).then(res=>{
                    resolve(res)
                })
            }
        })



        //TODO if we have rate
    })
};

that.getMinAmount = function(from, to){
    return new Promise(function(resolve, reject) {
        if(typeof that.api.getMinAmount !=="undefined" && typeof that.api.getMinAmount ==="function"){
            that.api.getMinAmount(from, to, function (err, data) {
                if (err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        }else{
            reject("can't find method")
        }
    })
};
that.getMinAmountForAllPairs = function(possiblePairs){
    return new Promise(function(resolve, reject) {

        var x = 0;
        var loopArray = function(possiblePairs){
            customAlert(possiblePairs[x], function () {
            x++;
            if(x < possiblePairs.length){
                loopArray(possiblePairs)
            }
            if (x === possiblePairs.length){
                resolve( possiblePairs)
            }
            })

        };

        var customAlert = function(msg, _runNext){
            that.api.getMinAmount(msg.from, msg.to, function (err, data) {
                if (err){
                    console.log(err)
                    _runNext()

                    // reject(err)
                }else{
                    if (typeof data.result === "undefined"){

                    }
                    possiblePairs[x].amount = data.result;
                    _runNext()


                }
            })
        };
        loopArray(possiblePairs)

    })
};
that.getExchangeAmount = function(from, to, amount){
    return new Promise(function(resolve, reject) {
        if(typeof that.api.getExchangeAmount !=="undefined" && typeof that.api.getExchangeAmount ==="function"){
            that.api.getExchangeAmount(from, to, amount, function (err, data) {
                if (err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        }else{
            reject("can't find method")
        }
    })
};
that.getExchangeAmountBulk = function(params){
    return new Promise(function(resolve, reject) {
        if(typeof that.api.getExchangeAmountBulk !=="undefined" && typeof that.api.getExchangeAmountBulk ==="function"){
            that.api.getExchangeAmountBulk(params, function (err, data) {
                if (err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        }else{
            reject("can't find method")
        }
    })
};

that.send = function(from, to, payoutAddress, amount, out_amount, refundAddress, savedPct,refund_address_ext, payout_address_ext){
    return new Promise(function(resolve, reject){
        if(typeof that.api.createTransaction !=="undefined" && typeof that.api.createTransaction ==="function"){

            that.api.createTransaction(from, to, payoutAddress, amount, refundAddress, function (err, data) {

                if (typeof data.error !== "undefined") {
                    reject(data.error)
                }
                if (err) reject(err);
                Rate.find({where:{currency_from: from, currency_to: to, exchanger: that.name}})
                .then((rate) => {


                    Order.create({
                        api_id: data.result.id,
                        public_id: randomID(5, '0') + '-' + randomID(2, '0'),
                        exchanger: that.name,
                        payin_currency: from,
                        payout_currency: to,
                        rate: rate.rate,
                        payin_amount: amount,
                        payin_amount_min: roundTo(Number(rate.min_amount), 6),
                        payout_amount: roundTo(Number(amount) * Number(rate.rate), 6),
                        saved_pct: savedPct,
                        payin_address: data.result.payinAddress,
                        payin_address_ext: 'payin_address_ext',
                        payout_address: payoutAddress,
                        payout_address_ext: (typeof payout_address_ext !== "undefined") ? payout_address_ext : "",
                        refund_address: refundAddress,
                        refund_address_ext: (typeof refund_address_ext !== "undefined") ? refund_address_ext : "",
                        progress: 0,
                        error: 0
                }).then(order => {
                        resolve(order)
                }).catch(err => reject(err))
            })
            })
        }
    })
};

module.exports = that;
// module.exports.getRates = function() {
//     return new Promise(function(resolve, reject) {
//
//         var message = {
//             "jsonrpc": "2.0",
//             "method": "getMinAmount",
//             "params": {
//                 "from": "ltc",
//                 "to": "eth"
//             },
//             "id": 1
//         };
//
//         var sign = crypto
//             .createHmac('sha512', "5b34f68b3aa6c42cde38559586d5dfbf8673973a3ee5fb58ca031f8bdbfc92e4")
//             .update(JSON.stringify(message))
//             .digest('hex');
//
//
//
//         var query = JSON.stringify(message);
//
//         var req = http.request({
//             host: "api.changelly.com",
//             port: 80,
//             method: "POST",
//             headers: {
//                 "api-key": "db7b195d64a245bdab9e3b1214053c3e",
//                 "sign":sign,
//                 "Accept": "*/*",
//                 "Content-Type": "application/json-rpc; charset=utf-8",
//                 "Content-Length": query.length
//             }
//         }, function (res) {
//             console.log(models.conf.api.changelly)
//
//
//             var body = "";
//             res.addListener('data', function (chunk) {
//                 body += chunk.toString();
//             });
//             res.addListener('end', function () {
//                 resolve(body);
//             });
//         });
//         req.end(query);
//     })
// };
//
//
