const strict = require('../helpers/utils-module/lib/strict')
const models = require('../models');
const Order = models.Order;
var crawler = require('request-promise');
const queryString = require('query-string');

var exchangers = {}
exchangers.components = {
    bittrex: require('./bittrex'),
    // kucoin: require('./kucoin'),
    binance: require('./binance'),
    changelly: require('./changelly'),
    shapeshift: require('./shapeshift'),
    smartjex: require('./smartjex'),
    // poloniex: require('./poloniex'),
    // huobi: require('./huobi'),
};
exchangers.getExplorerTxInfo = function(orderId, receivedAmount){
    return new Promise(async function(resolve, reject) {

        let order = await Order.find({where: {public_id:orderId}});
        let label =
            { timestamp: new Date(order.created_at).getTime() / 1000,
                sender: order.refund_address,
                receiver: order.payin_address,
                order_amount: order.payin_amount,
                received_amount: receivedAmount,
                ticker: order.payin_currency,
                public_id: order.public_id
            };
        let stringifed =  queryString.stringify(label, {sort: false});

        console.log("hello")
        console.log(models.conf.api.explorerAggregator.host + models.conf.api.explorerAggregator.methods.txByAddress + '?' + stringifed)
        let response = await crawler(models.conf.api.explorerAggregator.host + models.conf.api.explorerAggregator.methods.txByAddress + '?' + stringifed)
            resolve(response)
    })
};


exchangers.getOrderStep = function(exchanger, orderId){
    return new Promise(async function(resolve, reject) {



        let getOrderStepMethod = exchangers.components[exchanger].checkOrUpdateOrderStep;
            if (typeof getOrderStepMethod !== "undefined" && typeof getOrderStepMethod === "function") {
                await getOrderStepMethod(orderId)
                .then(response=>{ resolve(response) })
                .catch(err=>{ reject(err) })
            }else{
                let explorerData = await exchangers.getExplorerTxInfo(orderId)
                    resolve(explorerData)

            }
    })
}

// update рэйтов по паре тк за 15 минут этого не произошло
exchangers.updateRatesForPairs = function(from, to) {
    return new Promise(function(resolve, reject) {

        var processedExchangers = 0,
            updatedRatesForExchangers = [];
        Object.keys(exchangers.components).forEach( async function (key,index, exchangersArray) {

            let getRatesMethod = exchangers.components[key].getRatesForPair;
                if (strict.checkForFunctionType(getRatesMethod)) {

                    updatedRatesForExchangers.push(getRatesMethod(from, to))
                    // let response = await getRatesMethod(from, to);
                    // processedExchangers ++
                    //     if(response){
                    //         console.log(response)
                    //         updatedRatesForExchangers.push({
                    //             exchanger:response.exchanger, rate:response.rate,
                    //             min:response.min_amount, max:response.max_amount });
                    //     }

                        // .then(response=>{
                        //     processedExchangers ++;
                            // updatedRatesForExchangers.push({ exchanger:response.exchanger, rate:response.rate,
                            //     min:response.min_amount, max:response.max_amount });
                            // if (processedExchangers === exchangersArray.length) resolve(updatedRatesForExchangers);
                        // })
                        // .catch(err=>{
                        //     console.log("err")
                        //     console.log(err)
                        //
                        //     reject(err, " has UPDATE_RATES_BY_PAIR finished with error");
                        // });

                } else {
                    console.log("err")
                    console.log(key)
                    reject(key, " has no correct method UPDATE_RATES_BY_PAIR")
                }
            })
        Promise.all(updatedRatesForExchangers)
            .then(results => {
                // console.log(results)
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

exchangers.getRates = function(){

    Object.keys(exchangers.components).forEach(function(key) {
        let getRatesMethod = exchangers.components[key].getRates;
        if (typeof getRatesMethod !== "undefined" && typeof getRatesMethod === "function"){

          getRatesMethod()
              .then(resp=>{
                  console.log(resp)
              }).catch(err=>{
                  console.log(err)
          })

        }
    });
}
exchangers.getCurrencies = function(){

    Object.keys(exchangers.components).forEach(function(key) {
        let getCurrenciesMethod = exchangers.components[key].getCurrencies;
        if (typeof getCurrenciesMethod !== "undefined" && typeof getCurrenciesMethod === "function"){
            getCurrenciesMethod()
                .then(resp=>{
                    console.log(resp)
                }).catch(err=>{
                    console.log(err)
            })

        }
    });
}


exchangers.getExplorerTxBySender = function (orderObject) {
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

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                if (resp.statusCode == 200) {
                    resolve(JSON.parse(data))
                } else {
                    reject()
                }
            });
        }).on('error', reject);
    })


};



module.exports = exchangers;
