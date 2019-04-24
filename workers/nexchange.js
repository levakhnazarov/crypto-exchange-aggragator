const http = require('http');
const models = require('../models')
const nexchangeInstance = require('../exchangers').components.nexchange;
const pair = require('../helpers/utils-module/lib/pair')

const Currency = models.Currency
const Rate = models.Rate
const Order = models.Order
var pub = models.redisCli
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


const TIMEOUT = 6000;

var  fetchRates = async function () {

    //TODO + матчилка (trx в базе и tron в changelly)
    let allPairs = await pair.getAllPossiblePairsFromDatabase();
    let allNexchangeCurrencies = await nexchangeInstance.getCurrencies();
    let allNexchangePairsApi = await nexchangeInstance.getPairs();


    let allNexchangePairs = allPairs
        .filter(el=> {
            for(let i in allNexchangePairsApi.data){
                if (allNexchangePairsApi.data[i].base.toLowerCase() === el.from &&
                    allNexchangePairsApi.data[i].quote.toLowerCase() === el.to
                    && allNexchangePairsApi.data[i].disabled === false
                ) {
                    return true
                }
            }
            return false
        })
        .map(item=>{
            for(let i in allNexchangePairsApi.data){
                if (allNexchangePairsApi.data[i].base.toLowerCase() === item.from &&
                    allNexchangePairsApi.data[i].quote.toLowerCase() === item.to
                    && allNexchangePairsApi.data[i].disabled === false
                ) {



                    item.fee_ask = allNexchangePairsApi.data[i].fee_ask
                    // console.log(item)
                    // console.log(allNexchangePairsApi.data[i])
                    item.fee_bid = allNexchangePairsApi.data[i].fee_bid
                    return item
                }
            }
        })
        .map(item=>{
            for(let i in allNexchangeCurrencies.data){
                if(allNexchangeCurrencies.data[i].code.toLowerCase() === item.from){
                    item.min_amunt = allNexchangeCurrencies.data[i].minimal_amount
                    item.withdrawal_fee = allNexchangeCurrencies.data[i].withdrawal_fee
                    return item
                }
            }
        })

    ;

    console.log(allNexchangePairs)

return
    let minAmountObject = await nexchangeInstance.getMinAmountForAllPairs(allNexchangePairs);
    let minExchangeAmount = await nexchangeInstance.getExchangeAmountBulk(minAmountObject)

    let minExchangeAmountWithRates = minExchangeAmount.result.map(function(curr){
        curr.rate = curr.result / curr.amount;
        return curr
    });
    //~40s Oo


    //тест...
    // let minExchangeAmountWithRates = JSON.parse(require('fs').readFileSync('test/changelly/minExchangeAmountWithRates.json', 'utf8'));

    // let ratesFromDatabase = await Rate.findAll({where: {exchanger: process.env.NAME}})
    let ratesFromDatabase = await Rate.findAll({where: {exchanger: "changelly"}})

    var additionalRatesToCreate = minExchangeAmountWithRates.filter(item => {
        return ratesFromDatabase.filter(model => {
            return model.currency_from.toLowerCase() === item.from.toLowerCase() &&
                model.currency_to.toLowerCase() === item.to.toLowerCase()
        }).length === 0
    });
    console.log(additionalRatesToCreate)
    if (additionalRatesToCreate.length > 0) {
      await Rate.bulkCreate(additionalRatesToCreate.map(item => {
          return {
              currency_from: item.from.toLowerCase(),
              currency_to: item.to.toLowerCase(),
              rate: item.rate,
              min_amount: item.amount,
              max_amount: item.max ? item.max : null,
              exchanger: "changelly"
              // exchanger: process.env.NAME
          }
      }))
      .then((res) => {
          console.log(res)
                // update = true
       })
    }

    var ratesToRemove = ratesFromDatabase.filter(model => {
        return minExchangeAmountWithRates.filter(item => {
            return model.currency_from.toLowerCase() === item.from.toLowerCase() &&
                model.currency_to.toLowerCase() === item.to.toLowerCase()
        }).length === 0
    });
    console.log(ratesToRemove);

    for (let i = 0; i < ratesToRemove.length; i++) {
        let remove = ratesToRemove[i];
        await remove.destroy()
        // update = true
    }


    for (let i = 0; i < ratesFromDatabase.length; i++) {
        let rateFromDatabase = ratesFromDatabase[i];
        let item = minExchangeAmountWithRates.reduce((find, item) => {
            if (item.from.toLowerCase() === rateFromDatabase.currency_from.toLowerCase()
                && item.to.toLowerCase() === rateFromDatabase.currency_to.toLowerCase()) {
                return item
            }
            return find
        }, null);


        if (item && (Number(item.rate) !== Number(rateFromDatabase.rate) || Number(item.min) !== Number(rateFromDatabase.min_amount) ||
            Number(item.max) !== Number(rateFromDatabase.max_amount))) {
            rateFromDatabase.rate = item.rate
            rateFromDatabase.min_amount = item.min
            rateFromDatabase.max_amount = item.max
            await rateFromDatabase.save()
            // update = true
        }
    }



    var ratesFromDatabas = Rate.findAll({where: {exchanger: process.env.NAME}})
        .then(async models => {

            var update = false;

            // var additions = minExchangeAmountWithRates.filter(item => {
            //     return models.filter(model => {
            //         return model.currency_from.toLowerCase() == item.from.toLowerCase() &&
            //             model.currency_to.toLowerCase() == item.to.toLowerCase()
            //     }).length === 0
            // });

            // console.log(additions)

            // var removes = models.filter(model => {
            //     return rates.filter(item => {
            //         return model.currency_from.toLowerCase() == item.from.toLowerCase() &&
            //             model.currency_to.toLowerCase() == item.to.toLowerCase()
            //     }).length === 0
            // });
            //
            // for (var i = 0; i < removes.length; i++) {
            //     var remove = removes[i]
            //     await remove.destroy()
            //     update = true
            // }
            //
            // for (var i = 0; i < models.length; i++) {
            //     let model = models[i]
            //     let item = rates.reduce((find, item) => {
            //         if (item.from.toLowerCase() == model.currency_from.toLowerCase()
            //             && item.to.toLowerCase() == model.currency_to.toLowerCase()) {
            //             return item
            //         }
            //         return find
            //     }, null)
            //     if (item && (Number(item.rate) != Number(model.rate) || Number(item.min) != Number(model.min_amount) || Number(item.max) != Number(model.max_amount))) {
            //         model.rate = item.rate
            //         model.min_amount = item.min
            //         model.max_amount = item.max
            //         await model.save()
            //         update = true
            //     }
            // }
            //
            // if (add.length > 0) {
            //     await Rate.bulkCreate(add.map(item => {
            //         return {
            //             currency_from: item.from.toLowerCase(),
            //             currency_to: item.to.toLowerCase(),
            //             rate: item.rate,
            //             min_amount: item.min,
            //             max_amount: item.max,
            //             exchanger: process.env.NAME
            //         }
            //     }))
            //         .then(() => {
            //             update = true
            //         })
            //
            // }
            //
            // if (update) {
            //     pub.publish('rates-update', true);
            // }
            //
            // setTimeout(() => {
            //     fetchRates()
            // }, TIMEOUT)
        })//Currency.findAll()

  // ex.getCurrencies()
  //     .then(resp=>{
  //       console.log(resp)
  //
  //               setTimeout(() => {
  //                 fetchRates()
  //               }, TIMEOUT)
  //
  //     }).catch(error=>{
  //       console.log(error)
  // });


  // http.get('http://localhost:' + process.env.PORT + '/api/rates', (resp) => {
  //   let data = '';
  //   console.log("приветы")
  //
  //   resp.on('data', (chunk) => {
  //     data += chunk;
  //   });
  //
  //   resp.on('end', () => {
  //     var rates = JSON.parse(data);
  //
  //       Rate.findAll({where: {exchanger: process.env.NAME}})
  //       .then(async models => {
  //
  //       var update = false;
  //
  //       var add = rates.filter(item => {
  //         return models.filter(model => {
  //           return model.currency_from.toLowerCase() == item.from.toLowerCase() &&
  //             model.currency_to.toLowerCase() == item.to.toLowerCase()
  //         }).length === 0
  //       });
  //
  //       var removes = models.filter(model => {
  //         return rates.filter(item => {
  //           return model.currency_from.toLowerCase() == item.from.toLowerCase() &&
  //             model.currency_to.toLowerCase() == item.to.toLowerCase()
  //         }).length === 0
  //       });
  //
  //       for (var i = 0; i < removes.length; i++) {
  //         var remove = removes[i]
  //         await remove.destroy()
  //         update = true
  //       }
  //
  //       for (var i = 0; i < models.length; i++) {
  //         let model = models[i]
  //         let item = rates.reduce((find, item) => {
  //           if (item.from.toLowerCase() == model.currency_from.toLowerCase()
  //             && item.to.toLowerCase() == model.currency_to.toLowerCase()) {
  //             return item
  //           }
  //           return find
  //         }, null)
  //         if (item && (Number(item.rate) != Number(model.rate) || Number(item.min) != Number(model.min_amount) || Number(item.max) != Number(model.max_amount))) {
  //           model.rate = item.rate
  //           model.min_amount = item.min
  //           model.max_amount = item.max
  //           await model.save()
  //           update = true
  //         }
  //       }
  //
  //       if (add.length > 0) {
  //         await Rate.bulkCreate(add.map(item => {
  //           return {
  //             currency_from: item.from.toLowerCase(),
  //             currency_to: item.to.toLowerCase(),
  //             rate: item.rate,
  //             min_amount: item.min,
  //             max_amount: item.max,
  //             exchanger: process.env.NAME
  //           }
  //         }))
  //         .then(() => {
  //           update = true
  //         })
  //
  //       }
  //
  //       if (update) {
  //         pub.publish('rates-update', true);
  //       }
  //
  //       setTimeout(() => {
  //         fetchRates()
  //       }, TIMEOUT)
  //     })//Currency.findAll()
  //   });
  //
  // }).on("error", (err) => {
  //   // console.log("Error: " + err.message);
  //   setTimeout(() => {
  //     fetchRates()
  //   }, TIMEOUT)
  // });
}

fetchRates()


function checkStatus (id) {
  return new Promise(function(resolve, reject) {
    http.get('http://localhost:' + process.env.PORT + '/api/order/' + id, (resp) => {
      let data = '';
     
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
     
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        if (resp.statusCode == 200) {
          resolve(JSON.parse(data))  
        } else {
          reject()
        }
      });
    }).on('error', reject);
  })
}

function updateStatus() {

  Order.findAll({
    where: {
      progress: {
        [Op.in]: [0,1,2]
      },
      error: {
        [Op.not]: 1
      },
      exchanger: process.env.NAME
    },
  }).then(async items => {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      // console.log(item.status)
      await checkStatus(item.api_id).then(async res => {
        // console.log(item.progress, res.status)
        if (item.progress != res.status || res.status == -1) {
          
          if (res.status == -1) {
            item.error = 1
          } else {
            item.progress = res.status  
          }
          pub.publish('order:' + item.public_id, item.getStep());
          await item.save()
        }
      }).catch(err => console.log(err))
    }
    
    setTimeout(() => {
      updateStatus()
    }, TIMEOUT)
  }).catch(err => {
    setTimeout(() => {
      updateStatus()
    }, TIMEOUT)
  })
}

// updateStatus()
