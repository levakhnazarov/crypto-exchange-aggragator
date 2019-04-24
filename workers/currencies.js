const models = require('../models')
const Currency = models.Currency
var CoinMarketCap = require('node-coinmarketcap')
var coinmarketcap = new CoinMarketCap();

const Coinmarketcap = require('node-coinmarketcap-api');
const coinm = new Coinmarketcap();

var CoinMarket = require('node-coinmarketcap-rest-api');
var coin = new CoinMarket();



const UPDATE_TIMEOUT = 1000 * 60 * 15 // every 15 minutes
//TODO refactor
function loop () {


  Currency.findAll().then(currencies => {

      coin.getAllTickers(async coinFromMarketCap => {

      // console.log(currencies.length);

      var allMarketCurrencies = coinFromMarketCap.getAll();
      console.log(allMarketCurrencies.length)




      for (var i = 0; i < currencies.length; i++) {
        let coinFromDb = currencies[i];
        let coinFromMk     = coinFromMarketCap.get(coinFromDb.ticker);
        if(typeof coinFromMk === "undefined" ||
            typeof coinFromMk.price_usd === "undefined" ||
           typeof coinFromMk.percent_change_1h === "undefined" ||
           typeof coinFromMk.percent_change_24h === "undefined" ||
           typeof coinFromMk.percent_change_7d === "undefined") continue;
        let change1hUsd = coinFromMk.price_usd * coinFromMk.percent_change_1h / 100;
        let change24hUsd = coinFromMk.price_usd * coinFromMk.percent_change_24h / 100;
        let change7dUsd = (coinFromMk.price_usd * coinFromMk.percent_change_7d / 100).toFixed(2);
        let change7dPct = coinFromMk.percent_change_7d

          console.log(change7dPct)
        coinFromDb.name           = coinFromMk.name;
        coinFromDb.price_usd      = coinFromMk.price_usd;
        
        coinFromDb.change_1h_pct  = coinFromMk.percent_change_1h;
        coinFromDb.change_1h_usd  = parseFloat(change1hUsd).toFixed(2);

        coinFromDb.change_24h_pct = coinFromMk.percent_change_24h;
        coinFromDb.change_24h_usd = parseFloat(change24hUsd).toFixed(2);

        coinFromDb.change_7d_pct  = Number(change7dPct).toFixed(2)
        coinFromDb.change_7d_usd  = parseFloat(change7dUsd).toFixed(2);

        try{
            await coinFromDb.save();
        }catch(e){
            console.log(coinFromDb)
            console.log(e)
        }
      //флаг для отсеивания обновленных монет
        allMarketCurrencies.map(function(element){
          if (element.symbol.toLowerCase() === coinFromDb.ticker) {
            element.compared = true
              // console.log(element)
          }
        })

      }

      var allFilteredCoinMarketCapCurrencies = allMarketCurrencies.filter(function(element){
        return !element.hasOwnProperty("compared")
      });

          if (allFilteredCoinMarketCapCurrencies.length > 0) {

              allFilteredCoinMarketCapCurrencies.map(async item => {
                var change1hUsd = item.price_usd * item.percent_change_1h / 100,
                    change24hUsd = item.price_usd * item.percent_change_24h / 100,
                    change7dUsd = item.price_usd * item.percent_change_7d / 100;

                if (!isNaN(item.price_usd)){
                    await Currency.create({
                        name: item.name,
                        ticker: item.symbol.toLowerCase(),
                        // logo_type: 1,
                        // logo_src: "",
                        price_usd: item.price_usd,
                        change_1h_pct: item.percent_change_1h,
                        change_1h_usd: change1hUsd.toFixed(2),
                        change_24h_pct: item.percent_change_24h,
                        change_24h_usd: change24hUsd.toFixed(2),
                        change_7d_pct: item.percent_change_7d,
                        change_7d_usd: change7dUsd.toFixed(2)
                    }).then(resp=>{
                        console.log("coin ",resp.name,"created")

                    }).catch(err=>{
                        console.log(change24hUsd.toFixed(2))
                        console.log(err)
                    })
                }
              })

              // await Currency.bulkCreate(allFilteredCoinMarketCapCurrencies.map(item => {
              //     var change1hUsd = item.price_usd * item.percent_change_1h / 100,
              //         change24hUsd = item.price_usd * item.percent_change_24h / 100,
              //         change7dUsd = item.price_usd * item.percent_change_7d / 100;
              //
              //     return {
              //         name: item.name,
              //         ticker: item.symbol.toLowerCase(),
              //         // logo_type: 1,
              //         // logo_src: "",
              //         price_usd: item.price_usd,
              //         change_1h_pct: item.percent_change_1h,
              //         change_1h_usd: change1hUsd.toFixed(2),
              //         change_24h_pct: item.percent_change_24h,
              //         change_24h_usd: change24hUsd.toFixed(2),
              //         change_7d_pct: item.percent_change_7d,
              //         change_7d_usd: change7dUsd.toFixed(2)
              //     }
              // }))
              //     .then((res) => {
              //         console.log(res)
              //         // update = true
              //     })
              //     .catch((err)=>{
              //       console.log(err)
              //     })
          }
          console.log("coins updated")
      setTimeout(loop, UPDATE_TIMEOUT)
    })
  })
}

loop()
//
// var npm = require('npm');
// npm.load(function(err) {
//   // handle errors

//   // install module ffi
//   npm.commands.update(['cryptocurrencies'], function(er, data) {
//     // log errors or data
//     console.log(er,data)
//   });

//   npm.on('log', function(message) {
//     // log installation progress
//     console.log(message);
//   });
// });