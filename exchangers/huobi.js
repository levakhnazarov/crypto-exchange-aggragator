const models = require('../models');
var shapeshiftClient = require('shapeshift.io');
shapeshiftClient.cors = true;
const Rate = models.Rate;
const Order = models.Order;
const { Op } = require('sequelize')
var ccxt = require ('ccxt');


const roundTo = require('round-to');
const randomID = require("random-id");

var that = {
    name: "huobi",
    apiInstance: function () {
        return new ccxt.huobipro({
            'apiKey': models.conf.api.huobi.apiKey,
            'secret': models.conf.api.huobi.secret,
            // 'verbose':true,
            'timeout': 60000,
            'options': { 'adjustForTimeDifference': true }
        });
    }()

};


that.ifIsInMarket = function(currencies, from, to, reverse){
    let isInMarket = false;
    switch (reverse){
        case true:
            isInMarket = typeof currencies[to.toUpperCase() + '/' + from.toUpperCase()] !== 'undefined'
                && currencies[to.toUpperCase() + '/' + from.toUpperCase()].hasOwnProperty('active')
                && currencies[to.toUpperCase() + '/' + from.toUpperCase()].active !== false;
            break;
        case false:
            isInMarket = typeof currencies[from.toUpperCase() + '/' + to.toUpperCase()] !== 'undefined'
                && currencies[from.toUpperCase() + '/' + to.toUpperCase()].hasOwnProperty('active')
                && currencies[from.toUpperCase() + '/' + to.toUpperCase()].active !== false;
            break;
    }
    return isInMarket;

}


that.getRatesForPair = function(from, to) {
    return new Promise(async function(resolve, reject) {
        try{
            let currencies =  await that.apiInstance.load_markets ();
            let rateFromDatabase = await Rate.find({where: {exchanger: that.name, currency_from: from, currency_to: to, active: true}});

            if(rateFromDatabase && that.ifIsInMarket(currencies, from, to,rateFromDatabase.get().reverse)){

                let symbol = (rateFromDatabase.get().reverse === true) ? to.toUpperCase() + '/' + from.toUpperCase() : from.toUpperCase() + '/' + to.toUpperCase();
                const orders = await that.apiInstance.fetchOrderBook (symbol, 5);
                let rate = (rateFromDatabase.get().reverse) ? 1 / orders.asks[0 ][0] : orders.bids[0 ][0];
                let rateWithTradingFee = rate - (rate / 1000);

                if(rateFromDatabase){
                    rateFromDatabase.rate = rateWithTradingFee;
                    await rateFromDatabase.save().then(res=> resolve(res))
                }else{
                    await Rate.create({
                        exchanger: that.name,
                        currency_from: from,
                        currency_to: to,
                        rate: rateWithTradingFee,
                        active: false
                    }).then(res=> resolve(res))
                }

            }else{
                resolve(false)
                // //TODO refactor
                // if(typeof currencies[from.toUpperCase() + '/' + to.toUpperCase()] !== 'undefined' && currencies[from.toUpperCase() + '/' + to.toUpperCase()].active === false){
                //     await Rate.destroy(
                //         {where: {exchanger: that.name, [Op.or]:[{currency_from: from},{ currency_to: from}]}}).then(res => resolve(false))
                // }
                // if(typeof currencies[to.toUpperCase() + '/' + from.toUpperCase()] !== 'undefined' && currencies[to.toUpperCase()].active === false){
                //     await Rate.destroy(
                //         {where: {exchanger: that.name, [Op.or]:[{currency_from: to},{ currency_to: to}]}}).then(res => resolve(false))
                // }
                // resolve(false)
            }

        }catch(e){
            console.log(e);
            resolve(false)

        }
    })
};


that.send = function (from, to, withdrawalAddress, amount, out_amount, refundAddress, savedPct,refund_address_ext, payout_address_ext) {
    //long time running...

    return new Promise(async function(resolve, reject) {
        let isOnMaintenance = false;
        // TODO implement all error handling!!!
        let markets = await that.apiInstance.loadMarkets();

        // TODO implement 'is on maintenance'
        if(isOnMaintenance) reject("currently not working");
        if(!that.isPairActive(markets, from.toUpperCase() + '/' + to.toUpperCase())) reject("pair not active");

        let depositAddress = await that.apiInstance.fetchDepositAddress(from.toUpperCase()),
            depositAddressTag = depositAddress.info.addressTag;
            depositAddress = depositAddress.info.address;

        // TODO clarify all numbers and calc!
        let lastRateFromDb = await Rate.find({where:{currency_from: from, currency_to: to, exchanger: that.name}});


        let createdOrder = await Order.create({
            payout_address_ext: (typeof payout_address_ext !== "undefined") ? payout_address_ext : "",
            refund_address_ext: (typeof refund_address_ext !== "undefined") ? refund_address_ext : "",
            payout_amount: roundTo(Number(amount) * Number(lastRateFromDb.rate), 6),
            payin_amount_min: roundTo(Number(lastRateFromDb.min_amount), 6),
            public_id: randomID(5, '0') + '-' + randomID(2, '0'),
            payout_address: withdrawalAddress,
            payin_address_ext: depositAddressTag,
            payin_address: depositAddress,
            refund_address: refundAddress,
            api_id: null,
            exchanger: that.name,
            payin_currency: from,
            payin_amount: amount,
            payout_currency: to,
            saved_pct: savedPct,
            rate: lastRateFromDb.rate,
            progress: 0,
            error: 0,
            reverse: lastRateFromDb.reverse
        });
        resolve(createdOrder);

    });
};

that.isPairActive = function(currencies, pair){
    return typeof currencies[pair] !== 'undefined' && currencies[pair].hasOwnProperty('active')
        && currencies[pair].active !== false
}







that.getStatus = function(address){
    return new Promise(function(resolve, reject) {

        shapeshiftClient.status(address,function(err, statusString, completeResponse){
            if (err) {
                reject(err)
            }else{

                if (typeof completeResponse !== "undefined") resolve(completeResponse);
                    resolve(statusString)
            }
        })
    })
};

//pair formatted like 'eth_btc'
that.getDepositLimit = function(pair){
    return new Promise(function(resolve, reject){
        shapeshiftClient.depositLimit(pair, function(err, depositLimit){
            if(err){
                reject(err)
            }else{
                resolve(depositLimit)
            }
        })
    })
};

//pair formatted like 'eth_btc'
that.emailReceipt = function(email, txId){
    return new Promise(function(resolve, reject){
        shapeshiftClient.emailReceipt(email, txId, function(err, data){
            if(err || data.status !== "success"){
                console.log(err)
                console.log(data)
                reject(false)
            }else{
                resolve(true)
            }
        })
    })
};




that.getTxsByApiKeyAndDepoAddress = function(address) {
    return new Promise(async function(resolve, reject){

        shapeshiftClient.transactions(models.conf.api.shapeshift.privateKey, address,function(err, data){
            console.log(err)
            console.log(data)



        })




    })
}

module.exports = that
