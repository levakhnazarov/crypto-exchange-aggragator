const shapeshiftInstance = require('../exchangers').components.shapeshift;
const models = require('../models')
const pair = require('../helpers/utils-module/lib/pair')

const Currency = models.Currency
const Rate = models.Rate
const Order = models.Order
var pub = models.redisCli
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


const TIMEOUT = 6000;

var  fetchRates = async function () {
    let allPairs = await pair.getAllPossiblePairsFromDatabase();
    console.log(allPairs.length + "_all pair from db")
    console.time("filter_currencies")
    let allShapeshiftCurrencies = await shapeshiftInstance.getCurrencies();

    console.log(allShapeshiftCurrencies)

    let allShapeShiftPairs = allPairs.filter( el=>{
        var foundFrom, foundTo = false;
        for(let i in allShapeshiftCurrencies){
            if (allShapeshiftCurrencies[i].status === "unavailable") continue;
            if (el.from === allShapeshiftCurrencies[i].symbol.toLowerCase()) foundFrom = true;
            if (el.to === allShapeshiftCurrencies[i].symbol.toLowerCase()) foundTo = true;
        }
        if (foundFrom && foundTo){
            return true
        }else{
            return false
        }
    });
    console.timeEnd("filter_currencies")
    console.log(allShapeShiftPairs.length)
    console.log("hell")
    // console.log(allShapeShiftPairs)


    //GET MARKET INFO
    console.time("market_info")

    for (let i = 0;i<allShapeShiftPairs.length;i++){
        let res = await shapeshiftInstance.getMarketInfo(allShapeShiftPairs[i].from + "_" + allShapeShiftPairs[i].to)

        console.log(res)
        console.log(i +"_of" + allShapeShiftPairs.length)

        allShapeShiftPairs[i].rate = res.rate;
        allShapeShiftPairs[i].min_amount = res.minimum;
        allShapeShiftPairs[i].max_amount = res.limit;
    }
    console.timeEnd("market_info")

    console.log("got market info forall")



    // let ratesFromDatabase = await Rate.findAll({where: {exchanger: process.env.NAME}})
    let ratesFromDatabase = await Rate.findAll({where: {exchanger: "shapeshift"}})


    console.log(ratesFromDatabase.length + ' - rates from database length')
    // console.log(ratesFromDatabase)

    var additionalRatesToCreate = allShapeShiftPairs.filter(item => {
        return ratesFromDatabase.filter(model => {
            return model.currency_from.toLowerCase() === item.from.toLowerCase() &&
                model.currency_to.toLowerCase() === item.to.toLowerCase()
        }).length === 0
    });

    console.log(additionalRatesToCreate.length + ' - additional rates to create length')

    if (additionalRatesToCreate.length > 0) {
      await Rate.bulkCreate(additionalRatesToCreate.map(item => {
          return {
              currency_from: item.from.toLowerCase(),
              currency_to: item.to.toLowerCase(),
              rate: item.rate,
              min_amount: item.min_amount,
              max_amount: item.max_amount ? item.max_amount : null,
              exchanger: "shapeshift"
              // exchanger: process.env.NAME
          }
      }))
      .then((res) => {
          console.log(res)
                // update = true
       })
    }

    var ratesToRemove = ratesFromDatabase.filter(model => {
        return allShapeShiftPairs.filter(item => {
            return model.currency_from.toLowerCase() === item.from.toLowerCase() &&
                model.currency_to.toLowerCase() === item.to.toLowerCase()
        }).length === 0
    });
    console.log(ratesToRemove.length + ' - existing rates to remove ')

    for (let i = 0; i < ratesToRemove.length; i++) {
        let remove = ratesToRemove[i];
        await remove.destroy()
        // update = true
    }

    console.log(ratesFromDatabase.length + ' - existing rates to remove ')

    for (let i = 0; i < ratesFromDatabase.length; i++) {
        let rateFromDatabase = ratesFromDatabase[i];
        let item = allShapeShiftPairs.reduce((find, item) => {
            if (item.from.toLowerCase() === rateFromDatabase.currency_from.toLowerCase()
                && item.to.toLowerCase() === rateFromDatabase.currency_to.toLowerCase()) {
                return item
            }
            return find
        }, null);


        if (item && (Number(item.rate) !== Number(rateFromDatabase.rate) ||
            Number(item.min_amount) !== Number(rateFromDatabase.min_amount) ||
            Number(item.max_amount) !== Number(rateFromDatabase.max_amount))) {
            rateFromDatabase.rate = item.rate
            rateFromDatabase.min_amount = item.min_amount
            rateFromDatabase.max_amount = item.max_amount
            await rateFromDatabase.save()
            // update = true
        }
    }
    console.log("that's all")


};

fetchRates()
// shapeshiftInstance.getTxsByApiKeyAndDepoAddress("3NxnpTDSFiag6ztjsLw8K1gb4VR1D9y3WT")
//     .then(resp=>{
//         console.log(resp)
//     })
//     .catch(err=>{
//         console.log(err)
//     })


// shapeshiftInstance.checkOrUpdateOrderStep("24750-85")
//     .then(resp=>{
//         console.log(Object.keys(resp).length)
//     })
//     .catch(err=>{
//         console.log(err)
//     })


//количество монет у шэйпшифт
// shapeshiftInstance.getCurrencies()
//     .then(resp=>{
//         console.log(Object.keys(resp).length)
//     })
//     .catch(err=>{
//         console.log(err)
//     })


//test tags with xrp_xmr
var destTag = "022584013bb9c779f8e38512c6b2caa5eef5880e2694f48d1234567890abd080",
    widthdraw = "41hgaCaFC9MB1myjiEH6fZ4pkRm692gkNTqq85UPs9ZaDD65pDyYfq6UxvMvwCy46bPJRJu2hZ3NS6n6znSJoFEWN1pUcjG";

//test xmr_xrp
var destTag = "101915",
    widthdraw = "rG27qDvTxK2fAeU24WUNqqmgHqGwyGsnVD";

var options = {
    // returnAddress: address_ext,
    destTag: destTag,
    amount: 200,
};
// shapeshiftInstance.apiInstance.shift(widthdraw, "xmr_xrp", options, function (err, returnData) {
//     if (err) console.log(err);
//
//     console.log(returnData)
//
// })