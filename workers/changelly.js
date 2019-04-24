const http = require('http');
const models = require('../models')
const changellyInstance = require('../exchangers').components.changelly;
const pair = require('../helpers/utils-module/lib/pair')
const FileUtil = require('../helpers/utils-module').file
const Currency = models.Currency
const Rate = models.Rate
const Order = models.Order
var pub = models.redisCli
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const TIMEOUT = 6000;

var  fetchRates = async function (givenArrayChunk) {

    //TODO + матчилка (trx в базе и tron в changelly)

    let minAmountObject = await changellyInstance.getMinAmountForAllPairs(givenArrayChunk);
    // console.timeEnd("dbsave");
    // console.time("dbsave");
    let minExchangeAmount = await changellyInstance.getExchangeAmountBulk(minAmountObject)
    // console.timeEnd("dbsave");
    var  minExchangeAmountWithRates
    if(typeof minExchangeAmount.result.map === "function"){
        minExchangeAmountWithRates = minExchangeAmount.result.map(function(curr){
            curr.rate = curr.result / curr.amount;
            return curr
        });

    }else{
        console.log(minExchangeAmount)
        console.log("break")
        return
    }
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

    console.log("create rates ", additionalRatesToCreate.length)

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

    console.log("remove rates ", ratesToRemove.length)

    // for (let i = 0; i < ratesToRemove.length; i++) {
    //     let remove = ratesToRemove[i];
    //     await remove.destroy()
    //     // update = true
    // }


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

    console.log("good")




            //
            // if (update) {
            //     pub.publish('rates-update', true);
            // }
            //
            // setTimeout(() => {
            //     fetchRates()
            // }, TIMEOUT)


}

var fetchBy100 = async function (){

    console.time("getPairs");
    let allPairs = await pair.getAllPossiblePairsFromDatabase();
    let allChengellyCurrencies = await changellyInstance.getCurrencies();
    let allChangellyPairs = allPairs
    // let allChangellyPairs = allPairs.slice(1000,4000)
        .filter(el=> allChengellyCurrencies.result.indexOf(el.from) !== -1)
        .filter(el=> allChengellyCurrencies.result.indexOf(el.to) !== -1);
    console.timeEnd("getPairs");
    console.log(allChangellyPairs.length + "_changelly pairs");
    // console.log(allChangellyPairs);

    var i,j,temparray,chunk = 300;

    for (i=0,j=allChangellyPairs.length; i<j; i+=chunk) {



        console.time("get"+i+"_of_"+allChangellyPairs.length);
        temparray = allChangellyPairs.slice(i,i+chunk);

        var procs = await fetchRates(temparray)
        console.timeEnd("get"+i+"_of_"+allChangellyPairs.length)
        // do whatever
    }



}


/*
    fetchBy100
 */


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
// var svg = new QRCode("Hello World!").svg();
// let filepath = "/../../public/img/orders/dd.svg";
//
// var svg = "ASd"
//
// FileUtil.createFile(filepath, svg).then(
//     console.log("ok")
// ).catch(err=>{
//     console.log(err)
// })

updateStatus()
