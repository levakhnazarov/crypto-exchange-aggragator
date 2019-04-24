//TODO: refactor service worker to work as configurable standalone
//

const models = require('../models');
const fs = require('fs');
const Currency = models.Currency;
var rp = require('request-promise');
var rates = models.Rate;
var mv = require('mv');
const Op = models.Sequelize.Op;
const util = require('util')
// UPDATE AVAILABLE CURRENCIES
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].ticker === a[j].ticker)
                a.splice(j--, 1);
        }
    }

    return a;
};

async function updateAvailableTickers () {



    var client = models.redisCli,
        multi = client.multi();

    multi.del('available_currencies')
    multi.del('coin_base')

    multi.exec(async function(errors, results) {

    let coins = await Currency.available();


    let erc20Tokens = require("../helpers/erc20_tokens");
    let availableFromEthExplorer = erc20Tokens.map(function(elem){
        return { source: "etherscan", ticker: elem.symbol }
    });

    let availableFromChainz = await rp('http://chainz.cryptoid.info/explorer/api.dws?q=summary');
        availableFromChainz = JSON.parse(availableFromChainz)

    // var fs = require('fs');
    // var stream = fs.createWriteStream("no_result.json");
    // stream.once('open', function(fd) {
    //     stream.write(JSON.stringify(availableFromChainz));
    //     stream.end();
    // });
    for (let el in availableFromChainz) {
        availableFromEthExplorer.push({ source: "chainz", ticker: el })
    }
    availableFromEthExplorer.push({ source: "chainz", ticker: 'btc' })

    let etherchainz = coins.map(elem=>{
        for(let i = 0; i < availableFromEthExplorer.length;i++){

            if (elem.ticker === availableFromEthExplorer[i].ticker.toLowerCase()){
                elem.source = availableFromEthExplorer[i].source;
                return elem
            }
        }
    }).filter(elem=> typeof elem !== 'undefined');


    etherchainz.forEach(async function f(el) {

        let actualOne = await Currency.findOne({
            where: {ticker: el.ticker}
        })

        actualOne.explorer = el.source;
        await actualOne.save()

    })


    let exchangePairs = await rates.findAll({
        where: {
            exchanger: {
                [Op.notIn]: ['shapeshift', 'changelly']
            }
        }
    });




    exchangePairs.forEach(async function(el){
        var compared = false;
        for(let i = 0;i<etherchainz.length;i++){
            if(el.getDataValue("currency_from") === etherchainz[i].ticker.toLowerCase()){
                compared = true
            }
        }
        if (!compared){
            el.active = false;
            await el.save()
        }else{
            el.active = true;
            await el.save()
        }
    });


    let changellyShapeshiftPairs = await rates.findAll({
        where: {
            exchanger: {
                [Op.in]: ['shapeshift', 'changelly']
            }
        }
    }), changellyShapeshiftFromCurrencies = changellyShapeshiftPairs
        .map(function(elem){ return { ticker: elem.getDataValue("currency_from"), source: elem.getDataValue("exchanger") }}),
        changellyShapeshiftToCurrencies = changellyShapeshiftPairs
        .map(function(elem){ return { ticker: elem.getDataValue("currency_to"), source: elem.getDataValue("exchanger") } }),
        changellyShapeshiftCurrencies = changellyShapeshiftFromCurrencies
        .concat(changellyShapeshiftToCurrencies);


    // console.log(available)
    let coinss = await Currency.available();

    console.log(coinss)


    for(let i = 0; i < coinss.length; i++) {
        multi.rpush('available_currencies', coinss[i].ticker);
        multi.rpush('coin_' + 'base', JSON.stringify(coinss[i]));
    }


    multi.exec(function(errors, results) {
        console.log(results)
        console.log(errors)
    });
    });


}

updateAvailableTickers().then(resp=>{})




// update icons sprite
// Currency.available().then((result) => {
// const srcPath = '/../node_modules/cryptocurrency-icons/dist/svg/color';
// const destPath = '/../resources/images/currencies';
//
//
//     console.log(__dirname + destPath)
//     let results = [];
//         result.forEach(function(el){ results.push(el.ticker) });
//
//     fs.readdir(__dirname + destPath, function(err, items) {
//         if (err) throw err;
//
//             // comparing coins which have image
//         let compared = 0;
//         for (let i=0; i<items.length; i++) {
//             let item = items[i].split(".");
//                 item = item[0];
//
//             if(results.indexOf(item ) !== -1 || results.indexOf(item.toLowerCase() ) !== -1){
//                 items[i].compared = true;
//                 let index = results.indexOf(item);
//                 results.splice(index, 1);
//                 compared ++
//             }else{
//                 // console.log("not ",item)
//                 // fs.unlinkSync(path+"/"+items[i])
//             }
//         }
//         console.log(results.length)
//         for (let i=0; i<items.length; i++) {
//             if (items[i].compared){
//                 // console.log(items[i])
//             }
//         }
//         // move unexisting images from node folder
//         console.log(__dirname + srcPath)
//         fs.readdir(__dirname + srcPath, function(err, items) {
//             if (err) console.log(err)
//
//             for (let i=0; i<items.length; i++) {
//                 let item = items[i].split(".");
//                 item = item[0];
//
//                 if(results.indexOf(item ) !== -1){
//
//                     mv(__dirname + srcPath + '/' + items[i], __dirname + destPath + '/' + items[i], function(err) {
//                         if(err) console.log(err)
//                         results.splice(results.indexOf(item ), 1);
//                         // done. it tried fs.rename first, and then falls back to
//                         // piping the source file to the dest file and then unlinking
//                         // the source file.
//                     });
//
//                 }
//             }
//         })
//     });
//
// });









// GENERATE SITEMAP WEEKLY!

// setTimeout(function(){
//
// const SitemapGenerator = require('sitemap-generator');
// const generator = SitemapGenerator('localhost:3000', {
//     stripQuerystring: false,
//     maxEntriesPerFile: 50000,
// });
// rates.pairs().then(res=>{
//     for(let i in res) {
//         console.log( i+ '/offers/'+res[i].from + '-' + res[i].to)
//         generator.queueURL('/offers/'+res[i].from + '-' + res[i].to)
//     }
//
// })
//
//
// generator.on('done', (resp) => {
//     console.log(resp)
// });
// generator.on('error', (error) => {
//     console.log(error);
//     // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
// });
// generator.on('add', (url) => {
//     console.log(url)
//     // log url
// });
//
// generator.start();
//
// }, 1000);




// generator.queueURL(url)
