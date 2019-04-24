const models = require('../models');
var shapeshiftClient = require('shapeshift.io');
shapeshiftClient.cors = true;
const Rate = models.Rate;
const Order = models.Order;
const { Op } = require('sequelize')

const roundTo = require('round-to');
const randomID = require("random-id");
const crypto = require("crypto");
var that = {
    name: "shapeshift",
    apiInstance:shapeshiftClient,
};


that.getTxsByApiKeyAndDepoAddress = function(address) {
    return new Promise(async function(resolve, reject){

        shapeshiftClient.transactions(models.conf.api.shapeshift.privateKey, address,function(err, data){
            console.log(err)
            console.log(data)

        })
    })
}

that.checkOrUpdateOrderStep = function (orderId) {
    return new Promise(async function(resolve, reject) {
        var order = await models.Order.getByPublicId(orderId)
        var status = await that.getStatus(order.payin_address);

        var statusText = {}

        switch (status.status){
            case "no_deposits":
                resolve( { status:0 } );
                break;
            case "received":
                order.progress = 1;
                await order.save()
                statusText = { status:1 }
                break;
            case "complete":
                order.progress = 3;
                order.txIdUrl = status.transactionURL;
                await order.save();
                statusText = { status:3, txIdUrl:status.transactionURL };
                break;
            case "resolved":
                order.progress = 3;
                order.txIdUrl = status.transactionURL;
                await order.save();
                statusText = { status:3, txIdUrl:status.transactionURL };
                break;
        }

        resolve(statusText)

        // that.api.getTransactions(999, 0, "bch", "0x30bbcd53c587044f135c1c972b670a31b943ced5", null, function(err, data){
        //     if (err) console.log(err)
        //
        //     console.log(data)
        //     console.log(status)
        //
        //
        //     resolve(status)
        //
        // })


    })
}

that.getRatesForPair = function(from, to) {
    return new Promise(async function(resolve, reject) {

        try{
            let currencies =  await that.getCurrencies();
            let rateFromDatabase = await Rate.find({where: {exchanger: that.name, currency_from: from, currency_to: to}});
            // found
            if(typeof currencies[from.toUpperCase()] !== 'undefined'
                && currencies[from.toUpperCase()].status !== 'unavailable'
                && typeof currencies[to.toUpperCase()] !== 'undefined'
                && currencies[to.toUpperCase()].status !== 'unavailable'){

                that.getMarketInfo(from + "_" + to).then(async (marketInfo)=>{
                    // высчитываем коэффицент на основе max limit не забывая учесть minerFee
                    let rateWithFee = (marketInfo.limit * marketInfo.rate - marketInfo.minerFee) / marketInfo.limit;

                    //TODO if we have rate
                    if(rateFromDatabase){
                        rateFromDatabase.min_amount = marketInfo.minimum;
                        rateFromDatabase.rate = rateWithFee;
                        rateFromDatabase.max_amount = marketInfo.limit;
                        await rateFromDatabase.save().then(res=> resolve(res))
                    }else{
                        await Rate.create({
                            exchanger: that.name,
                            currency_from: from,
                            currency_to: to,
                            min_amount: marketInfo.minimum,
                            rate: rateWithFee,
                            max_amount: marketInfo.limit
                        }).then(res=> resolve(res))
                    }
                }).catch((error)=>{
                    return resolve(false)

                })
            }else{
                //TODO refactor
                if(typeof currencies[from.toUpperCase()] !== 'undefined' && currencies[from.toUpperCase()].status === 'unavailable'){
                await Rate.destroy(
                    {where: {exchanger: that.name, [Op.or]:[{currency_from: from},{ currency_to: from}]}}).then(res => resolve(false))
                }
                if(typeof currencies[to.toUpperCase()] !== 'undefined' && currencies[to.toUpperCase()].status === 'unavailable'){
                    await Rate.destroy(
                        {where: {exchanger: that.name, [Op.or]:[{currency_from: to},{ currency_to: to}]}}).then(res => resolve(false))
                }
                return resolve(false)
            }

        }catch(e){
            return resolve(false)
        }

    })
};

that.getCurrencies = function(){
    return new Promise(function(resolve, reject) {

        shapeshiftClient.coins(function(err, response){
            if (err) {
                reject(err)
            }else{
                resolve(response)
            }
        })
    })
};
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
that.getMarketInfo = function(pair){
    return new Promise(function(resolve, reject){
        shapeshiftClient.exchangeRate(pair, function(err, marketInfo){
            if(err){
                reject(err)
            }else{
                resolve(marketInfo)
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

//pair formatted like 'eth_btc'
that.isDown = function(){
    return new Promise(function(resolve, reject){
        shapeshiftClient.isDown(function(err, data){
            switch (data){
                case true:
                    resolve(true);
                    break;
                case false:
                    resolve(false);
                    break;
            }
        })
    })
};




that.send = function (from, to, withdrawalAddress, amount, out_amount, refundAddress, savedPct,refund_address_ext, payout_address_ext) {
    var pair = from + "_" + to,
        options = {
            returnAddress: refundAddress,
            destTag: (typeof payout_address_ext !== "undefined") ? payout_address_ext : "",
            apiKey: models.conf.api.shapeshift.publicKey,
            amount: (typeof out_amount !== "undefined") ? out_amount : ""

        };
    //long time running...

    return new Promise(async function(resolve, reject) {

        let isDown = await that.isDown();
        if(!isDown){
        shapeshiftClient.shift(withdrawalAddress, pair, options, function (err, returnData) {
            if (err) reject(err);

            console.log(returnData)
            // ShapeShift owned BTC address that you send your BTC to
            var depositAddress = returnData.deposit;

            // you need to actually then send your BTC to ShapeShift
            // you could use module `spend`: https://www.npmjs.com/package/spend
            // spend(SS_BTC_WIF, depositAddress, shiftAmount, function (err, txId) { /.. ../ })

            // later, you can then check the deposit status


            // shapeshiftClient.status(depositAddress, function (err, status, data) {
            //     console.log(status) // => should be 'received' or 'complete'
            // })
            let payinAddressExt;
            if (from === "XRP"){
                payinAddressExt = (typeof returnData.xrpDestTag !== "undefined") ? returnData.xrpDestTag : ""
            }

            Rate.find({where:{currency_from: from, currency_to: to, exchanger: that.name}})
                .then((rate) => {

                    Order.create({
                        api_id: returnData.orderId,
                        public_id: randomID(5, '0') + '-' + randomID(2, '0'),
                        exchanger: that.name,
                        payin_currency: from,
                        payout_currency: to,
                        rate: rate.rate,
                        payin_amount: amount,
                        payin_amount_min: roundTo(Number(rate.min_amount), 6),
                        payout_amount: roundTo(Number(amount) * Number(rate.rate), 6),
                        saved_pct: savedPct,
                        payin_address: depositAddress,
                        payin_address_ext: payinAddressExt,
                        payout_address: returnData.withdrawal,
                        payout_address_ext: (typeof payout_address_ext !== "undefined") ? payout_address_ext : "",
                        refund_address: refundAddress,
                        refund_address_ext: (typeof refund_address_ext !== "undefined") ? refund_address_ext : "",
                        progress: 0,
                        error: 0
                    }).then(order => {
                        resolve(order)
                    }).catch(err => reject(err))
                })
                .catch(err => reject(err))

            })
        }else{
            reject("currently not working")
        }
    });
};

module.exports = that
