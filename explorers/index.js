const COINS_DEFAULT_SORT = ['price_usd', 'desc']
const strict = require('../helpers/utils-module/lib/strict')
const models = require('../models');
const Currency = models.Currency;
var crawler = require('request-promise');
const erc20 = require('erc20_tokens');
const CHAINZ_NAME = 'chainz';
const ETHERSCAN_NAME = 'etherscan';

var explorers = {};
explorers.components = {
    chainz: require('./chainz'),
    // etherscan: require('./eth erscan'),

};

let redisCli = function(){
    //TODO close connection handling

    var redis     = require('redis');
    var sub;
    if (process.env.REDISTOGO_URL) {
        let rtg   = require("url").parse(process.env.REDISTOGO_URL);
        sub = redis.createClient(rtg.port, rtg.hostname);
        sub.auth(rtg.auth.split(":")[1]);

        sub = redis.createClient(rtg.port, rtg.hostname);
        sub.auth(rtg.auth.split(":")[1]);

    } else {
        // sub = redis.createClient(6379, 'redis');
        sub = redis.createClient();
    }

    return sub
}

//TODO REFACTOR

explorers.updateCoinExplorers = function() {
    return new Promise(async function(resolve, reject) {
        //refactor to use abstract explorer interface function

        let chainzTickers = [], etherscanTickers = [];
        let chainzCurrencies = await crawler("http://chainz.cryptoid.info/explorer/api.dws?q=summary");
        let erc20Currencies = erc20.token_data('symbol_to_details');
            chainzCurrencies = JSON.parse(chainzCurrencies);
            for(let i in chainzCurrencies){ chainzTickers.push(i.toUpperCase()) }
            for(let i in erc20Currencies){ etherscanTickers.push(i) }


        redisCli().lrange('available_currencies', 0, -1, function (err, availableTickers) {
            if(err)reject(err);
            Currency.findAll({
                where: {
                    ticker: availableTickers
                },
                offset: 0,
                limit: 1000,
                order: [COINS_DEFAULT_SORT]
            }).then(async (activeDbCoins) => {


                for(let i = 0; i < activeDbCoins.length;i++){
                    let currentValue = activeDbCoins[i]


                    for(let i in etherscanTickers) {
                        if(etherscanTickers[i] === currentValue.ticker.toUpperCase()){
                            currentValue.explorer = ETHERSCAN_NAME;
                            try {

                                await currentValue.save()
                            }catch (e) {
                                reject(e)
                            }
                        }
                    }

                    for(let i in chainzTickers) {
                        if(chainzTickers[i] === currentValue.ticker.toUpperCase()){
                            currentValue.explorer = CHAINZ_NAME;
                            try {

                                await currentValue.save()
                            }catch (e) {
                                reject(e)
                            }
                        }
                    }


                    if(currentValue.ticker.toUpperCase() === 'BTC' || currentValue.ticker.toUpperCase() === 'BCH'){
                        currentValue.explorer = 'https://blockchain.info/address/%s?format=json&offset=0';
                        try {

                            await currentValue.save()
                        }catch (e) {
                            reject(e)
                        }

                    }

                    if(currentValue.ticker.toUpperCase() === 'DASH'
                        || currentValue.ticker.toUpperCase() === 'ZEC'
                        || currentValue.ticker.toUpperCase() ===  'DOGE'
                        || currentValue.ticker.toUpperCase() ===  'LTC'){
                        currentValue.explorer = 'https://chain.so/api/v2/get_tx_spent/'+currentValue.ticker.toUpperCase()+'/%s'
                        try {

                            await currentValue.save()
                        }catch (e) {
                            reject(e)
                        }
                    }

                    if(currentValue.ticker.toUpperCase() === 'NEO'
                        || currentValue.ticker.toUpperCase() === 'ONT'
                        || currentValue.ticker.toUpperCase() ===  'GAS'
                        || currentValue.ticker.toUpperCase() ===  'DBC'
                        || currentValue.ticker.toUpperCase() ===  'TKY'
                        || currentValue.ticker.toUpperCase() ===  'RPX'
                        || currentValue.ticker.toUpperCase() ===  'TNC'
                        || currentValue.ticker.toUpperCase() ===  'QLC'
                        || currentValue.ticker.toUpperCase() ===  'ZPT'
                        || currentValue.ticker.toUpperCase() ===  'ACAT'
                        || currentValue.ticker.toUpperCase() ===  'ELA'){
                        currentValue.explorer = 'https://api.neoscan.io/api/main_net/v1/get_balance/%s'
                        try {

                            await currentValue.save()
                        }catch (e) {
                            reject(e)
                        }
                    }
                }


                resolve(activeDbCoins)

            })
            .catch((err)=>{
                reject(err)
            })


        });


    })
}

explorers.updateRatesForPairs = function(from, to) {
    return new Promise(function(resolve, reject) {

        var processedExchangers = 0,
            updatedRatesForExchangers = [];
        Object.keys(explorers.components).forEach( async function (key, index, exchangersArray) {

            let getRatesMethod = explorers.components[key].getRatesForPair;
            if (strict.checkForFunctionType(getRatesMethod)) {
                updatedRatesForExchangers.push(getRatesMethod(from, to))

            } else {

                reject(key, " has no correct method UPDATE_RATES_BY_PAIR")
            }
        });
        Promise.all(updatedRatesForExchangers)
            .then(results => {

                var offers = [];
                for(let i = 0; i < results.length;i++){
                    if (results[i]){
                        offers.push({
                            exchanger:results[i].exchanger,
                            rate:results[i].rate,
                            min:results[i].min_amount,
                            max:results[i].max_amount
                        });
                    }
                }
                resolve(offers)

            })
            .catch(err => console.log('Catch', err));

    })
};

explorers.getExplorerByCoin = function (ticker) {


};

explorers.getExplorerTxBySender = function (orderObject) {
    return new Promise(function(resolve, reject) {
        let url;

        switch (orderObject.payin_currency().toUpperCase()) {
            case 'ETH':
                url ='http://api.etherscan.io/api?module=account&action=txlist&address=' + orderObject.refund_address +
                    '&startblock=0&endblock=99999999&sort=asc&apikey=' + models.conf.etherscan;

                break;
            default:
                url = 'http://chainz.cryptoid.info/'+orderObject.payin_currency() + '/api.dws' +
                    '?q=multiaddr&active=' + orderObject.refund_address+'&key=' +
                    models.conf.chainz;

                break;


        }
        http.get(url, (resp) => {
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



    // http://api.etherscan.io/api?module=account&action=txlist&address=0x18aafa4f2cf29090c719d39b5774aec9bd1db7ac&startblock=0&endblock=99999999&sort=asc&apikey=PP8WJZ7WXR2RAHRRRN66E3BGRVGH4N2XE1

    // http://chainz.cryptoid.info/coin/api.dws


};



module.exports = explorers;