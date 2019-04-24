const models = require('../models')
const Order = require('../models').Order
const pair = require('../helpers/utils-module/lib/pair');
const Rate = models.Rate;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const UPDATE_STATUS_TIMEOUT = 100000
var ip = require('ip');
var ccxt = require ('ccxt');
const Income = require('../models').Income
const Trade = require('../models').Trade
const exchangers = require('../exchangers')
var  fetchRates = async function () {
    // let allPairs = await pair.getAllPossiblePairsFromDatabase();
    // console.log(allPairs.length + "_all pair from db");

    let exchange = new ccxt.binance({
        'apiKey': models.conf.api.binance.apiKey,
        'secret': models.conf.api.binance.secret,
        // 'verbose':true,
        'timeout': 60000,
        'options': { 'adjustForTimeDifference': true }

    });
    let account_fees = await exchange.fees

    // console.log(account_fees)


    let allBinancePairs = [];
    let markets = await exchange.load_markets ();
    var count = 0;


    //GET MARKET INFO
    console.time("market_info")
    const limit = 5;
        // console.log(account_fees.funding)
        // console.log(account_fees)
    for(let market in markets){
        let orders = await exchange.fetchOrderBook (markets[market].symbol, limit);
        if(orders.bids.length < 1) {
            continue
        }
        console.log(orders)
        // console.log(orders.bids[orders.bids.length -1 ][0])
        // throw new Error("sd")

        let bidRate = orders.bids[orders.bids.length -1 ][0];
        let bidRateWithTradingFee = bidRate - (bidRate / 1000);

        let askRate = 1 / orders.asks[orders.asks.length -1 ][0];
        let askRateWithTradingFee = askRate - (askRate / 1000);

        if(typeof account_fees.funding.withdraw[markets[market].quote] === 'undefined') {
            console.log("quote")
            console.log(account_fees.funding.withdraw)


            // console.log(account_fees.funding.withdraw[markets[market].quote],account_fees.funding.withdraw[markets[market].quote] * 4)
            // console.log(account_fees.funding.withdraw[markets[market].base],account_fees.funding.withdraw[markets[market].base] * 4)
            // console.log(markets[market])

            // return
        }
        if(typeof account_fees.funding.withdraw[markets[market].base] === 'undefined') {
            console.log("base")
            console.log(account_fees.funding.withdraw)
            console.log(account_fees.funding.withdraw[markets[market].quote],account_fees.funding.withdraw[markets[market].quote] * 4)
            console.log(account_fees.funding.withdraw[markets[market].base],account_fees.funding.withdraw[markets[market].base] * 4)
            console.log(markets[market])

            // return
        }




        let wthFee = account_fees.funding.withdraw[markets[market].quote] === 'undefined' ? 0 : account_fees.funding.withdraw[markets[market].quote]

        allBinancePairs.push({
            from:markets[market].base,
            to: markets[market].quote,
            rate: bidRateWithTradingFee,
            reverse: false,
            wth_fee: wthFee,
            min_amount:wthFee * 4,
            max_amount:markets[market].limits.amount.max
        })

        let baseFee = account_fees.funding.withdraw[markets[market].base] === 'undefined' ? 0 : account_fees.funding.withdraw[markets[market].base]

        allBinancePairs.push({
            from:markets[market].quote,
            to: markets[market].base,
            rate: askRateWithTradingFee,
            reverse: true,
            wth_fee: baseFee,
            min_amount:baseFee * 4,
            max_amount:markets[market].limits.amount.max
        })
        console.log(markets[market].symbol)

    }
    console.log(count, "_all pairs length")

    console.timeEnd("market_info")
    console.log("...got market info forall")

    let ratesFromDatabase = await Rate.findAll({where: {exchanger: "binance"}})

    console.log(ratesFromDatabase.length + ' - rates from database length')

    var additionalRatesToCreate = allBinancePairs.filter(item => {
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
              reverse: item.reverse,
              min_amount: item.min_amount ? item.max_amount : null,
              max_amount: item.max_amount ? item.max_amount : null,
              exchanger: "binance",
              withdrawal_fee: item.wth_fee

          }
      }))
      .then((res) => {
          // console.log(res)
                // update = true
       })
    }

    var ratesToRemove = ratesFromDatabase.filter(model => {
        return allBinancePairs.filter(item => {
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
        let item = allBinancePairs.reduce((find, item) => {
            if (item.from.toLowerCase() === rateFromDatabase.currency_from.toLowerCase()
                && item.to.toLowerCase() === rateFromDatabase.currency_to.toLowerCase()) {
                return item
            }
            return find
        }, null);


        if (item && (Number(item.rate) !== Number(rateFromDatabase.rate) ||
            Number(item.min_amount) !== Number(rateFromDatabase.min_amount) ||
            Number(item.max_amount) !== Number(rateFromDatabase.max_amount)))
        {
            rateFromDatabase.rate = item.rate;
            rateFromDatabase.min_amount = item.min_amount ? item.min_amount : 0;
            rateFromDatabase.max_amount = item.max_amount;
            rateFromDatabase.withdrawal_fee = item.wth_fee ? item.wth_fee : 0;
            await rateFromDatabase.save()
            // update = true
        }
    }
    console.log("that's all")


};






function updateStatus() {

    Order.findAll({
        where: {
            progress: {
                [Op.in]: [0,1]
            },
            error: {
                [Op.not]: 1
            },
            exchanger: "binance"
        },
    }).then(async activeOrders => {


        for (let i = 0; i < activeOrders.length; i++) {
            var item = activeOrders[i];


            checkStatus(item).then(async res => {

                console.log(res)
                // console.log(item.progress, res.status)
                // if (item.progress != res.status || res.status == -1) {
                //
                //     if (res.status == -1) {
                //         item.error = 1
                //     } else {
                //         item.progress = res.status
                //     }
                // pub.publish('order:' + item.public_id, item.getStep());
                //     await item.save()
                // }
            }).catch(err => console.log(err))




        }

        setTimeout(() => {
            updateStatus()
        }, UPDATE_STATUS_TIMEOUT)


    }).catch(err => {


        setTimeout(() => {
            updateStatus()
        }, UPDATE_STATUS_TIMEOUT)
    })
}

//TODO пришла пачка транзакций.
// берем депозиты пришедшие после оформления заказа
// по каждому сравниваем исходящие операции отправителя после оформления заказа
//

function checkStatus (orderObject) {
    return new Promise(async function(resolve, reject) {
        let response = {
            order:orderObject.public_id,
            orderFrom: orderObject.payin_currency,
            amountFrom: orderObject.payin_amount,
            amountTo: orderObject.payout_amount,
            orderTo: orderObject.payout_currency,
            pendingStatus: 'pending',
            message: '',
        };

        let exchange = new ccxt.binance({
            'apiKey': models.conf.api.binance.apiKey,
            'secret': models.conf.api.binance.secret,
            'verbose':false,
            'timeout': 60000,
            'nonce': function () { return this.milliseconds () },
            'options': { 'adjustForTimeDifference': true }

        });
        //     let orderBooks = await exchange.fetchOrderBook('ETH/BTC', 5);
        //     console.log(orderBooks)
        // throw new Error('ss')
        let account_deposits = await exchange.fetchBalance();
        let account_fees = await exchange.fees;
        let currencyObject = await Currency.findOne({ where: {ticker: orderObject.get().payin_currency.toUpperCase()} });
        let orderIncomeObject = await Income.findOne({ where: {order_id:  currencyObject.get().public_id} });
        let hasMarketTrade = exchange.has['createMarketOrder'],
            buyTicker = (!orderObject.reverse) ? orderObject.payout_currency.toUpperCase() : orderObject.get().payin_currency.toUpperCase(),
            sellTicker = (!orderObject.reverse) ? orderObject.get().payin_currency.toUpperCase() : orderObject.payout_currency.toUpperCase() ,
            withdrawalAddress = orderObject.get().payout_address,
            withdrawalAddressTag = orderObject.get().payout_address_ext,
            freeSellBalance = account_deposits[sellTicker].free,
            freeBuyBalance = account_deposits[buyTicker].free,
            symbol = sellTicker + '/' + buyTicker,
            ifSenderDidSuchWithdraw = false,
            receivedAmount,
            withdrawFee =
                (typeof account_fees.funding.withdraw[buyTicker] === 'undefined') ? 0 : account_fees.funding.withdraw[buyTicker];



        // let ordrBook = await exchange.fetchOrderBook(symbol, 5);
        // console.log(ordrBook['bids'][ordrBook['bids'].length - 1][0])
        // console.log(ordrBook['bids'][0][0])
        //
        // console.log(ordrBook['asks'][ordrBook['asks'].length - 1][0])
        // console.log(ordrBook['asks'][0][0])
        // throw new Error("dsf")


        //TODO обработка статусов pending transactions
        let transactionHistory = await exchange.request('deposithistory?currency='+orderObject.get().payin_currency.toUpperCase()+'&nonce=' + exchange.nonce(),'account')
        // let orderIncomes = await Income.findAll({
        //     where: {
        //         currency: currencyObject.get().id,
        //         order_id: currencyObject.get().public_id,
        //         // closed: false,
        //         exchanger: "bittrex"
        //     },
        // });
        // filter if we got new income
        // let openedTransactions = transactionHistory.result.filter(tx=>{
        //     let found = false;
        //     for(let i = 0;i < orderIncomes.length;i++){
        //         if(tx.TxId === orderIncomes[i].get().txid && orderIncomes[i].get().closed === true) found = true
        //     }
        //     return !found;
        // });

        // console.log(openedTransactions)

        var processingDbIncome, orderIncome;

        for(let i = 0;i<transactionHistory.result.length;i++){

            var transactionTime = transactionHistory.result[i].LastUpdated;
            if(!transactionTime.includes('Z')) transactionTime = transactionTime + 'Z';
            //если время времени создания заказа больше прихода депозита
            if(Date.parse(orderObject.get().created_at ) / 1000 > Date.parse( transactionTime ) / 1000){
                continue
            }

            ifSenderDidSuchWithdraw = await exchangers.getExplorerTxInfo(orderObject.get().public_id, transactionHistory.result[i].Amount);
            if(ifSenderDidSuchWithdraw) {
                //берем первую подходящую по сумме и времени
                orderIncome = transactionHistory.result[i];
                break;
            }
        }
        if(!ifSenderDidSuchWithdraw) {
            response.message = 'sender did not do such transaction';
            return resolve(response);
        }


        response.freeSellBalance = freeSellBalance;
        response.freeBuyBalance = freeBuyBalance;
        response.orderIncomeAmount = orderIncome.Amount;


        if (freeSellBalance < orderIncome.Amount) {
            response.message = 'not enough deposit amount';
            return resolve(response);

        }
        processingDbIncome = await Income.create({
            exchanger: 'binance',
            txid: orderIncome.TxId,
            currency: currencyObject.get().id,
            amount: orderIncome.Amount,
            order_id: orderObject.public_id,
            closed: false,
        });

        console.log('processing db income',processingDbIncome)
        response.incomeTx = orderIncome.TxId;

        let orderBook = await exchange.fetchOrderBook(symbol, 5);

        let orderCreated;
        // if(hasMarketTrade){
        // orderCreated = await exchange.createMarketSellOrder (symbol, orderIncome.Amount);
        // }else{

        if (!orderObject.reverse){
            orderCreated = await exchange.createLimitSellOrder (symbol, orderIncome.Amount, orderBook['bids'][orderBook['bids'].length - 1][0])
        }else{
            orderCreated = await exchange.createLimitBuyOrder (symbol, orderIncome.Amount, orderBook['asks'][orderBook['asks'].length - 1][0])
        }
        // }


        console.log('order created', orderCreated)


        let orderCompared = false;
        let exchangedAmount = 0;

        //TODO if order executed not immediate
        let orderExecuted = await exchange.fetchClosedOrders (symbol);

        for(let i = 0; i < orderExecuted.length; i++){
            if (orderCreated.id === orderExecuted[i].id){
                orderCompared = orderExecuted[i];
                exchangedAmount = orderExecuted[i].cost - orderExecuted[i].fee.cost
                exchangedAmount = exchangedAmount.toFixed(8)
                orderObject.trade_id = orderCreated.id;
            }
        }

        console.log('compared from trade history', orderCompared)

        //TODO correct withdraw
        if (!orderCompared || exchangedAmount === 0){
            response.pendingStatus = 'failed after trade';
            return resolve(response)
        }
        //TODO сбор всех withdraw fee!!!
        let filled_rate = (exchangedAmount - withdrawFee) / orderObject.payin_amount;

        let processedTrade = await Trade.create({
            exchanger: 'binance',
            txid: orderIncome.TxId,
            currency: currencyObject.get().id,
            amount: orderIncome.Amount,
            rate: orderObject.get().rate,
            filled_rate: filled_rate,
            filled_amount: exchangedAmount,
            closed: true,
            exchange_order_id: orderCreated.id,
            public_order_id: orderObject.get().public_id
        });


        response.pendingStatus = 'filled';

        console.log(orderObject.get().rate, filled_rate, freeSellBalance, freeBuyBalance)

        console.log("try withdraw", buyTicker, exchangedAmount, withdrawalAddress, withdrawalAddressTag)
        let withdraw
        try {
            withdraw = await exchange.withdraw(buyTicker, exchangedAmount, withdrawalAddress, withdrawalAddressTag);
            orderObject.filled_rate = filled_rate
            orderObject.withdrawal_id = withdraw.id;
            orderObject.progress = 2;

            processingDbIncome.closed = true;
            await processingDbIncome.save();
            await orderObject.save();
            response.pendingStatus = 'success';
            return resolve(response)
        }catch(e){

            console.log(e)
            return resolve(response)
        }



    })
}

// console.log(ip.address())
fetchRates().then(data=>{
    console.log("daat",data)
})
// updateStatus()