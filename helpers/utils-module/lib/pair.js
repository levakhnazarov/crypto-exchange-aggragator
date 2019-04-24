let models = require( '../../../models/index');
const Rates = models.Rate;
const Currency = models.Currency;
const { Op } = require('sequelize')
exports.getAllPossiblePairsFromDatabase = async function() {
  var results = [],
      currencies = await Currency.findAll();

      currencies.forEach(function (val, i, arr) {

        for (let x = 0; x < arr.length;x++){
          if (val.ticker === arr[x].ticker) continue;
            results.push({
                from:val.ticker,
                to: arr[x].ticker
            })
        }
      })
  
  return results;
  
}

exports.getList = async function() {
  var results = [],
    currencies = await Currency.findAll(),
    rates = await Rates.findAll();
  
  for (var i = 0; i < currencies.length; i++) {
    var currencyItem = {};
    currencyItem.abbr = currencies[i].abbr;
    currencyItem.name = currencies[i].name;
    currencyItem.icon = currencies[i].icon;
    currencyItem.rates = [];

    var itemRates = {};
    for (var j = 0; j < rates.length; j++) {
      if (currencyItem.abbr == rates[j].from) {
        var key = rates[j].from + '_' + rates[j].to;
        if (typeof itemRates[key] === 'undefined' || itemRates[key].rate < rates[j].rate) {
          itemRates[key] = {
            from: rates[j].from,
            to: rates[j].to,
            rate: rates[j].rate,
            exchanger: rates[j].exchanger
          }
        }
      }
    }
    for ( var itemKey in itemRates ) {
      if ( itemRates.hasOwnProperty(itemKey) ) {
        itemRate = itemRates[itemKey];
        currencyItem.rates.push(itemRate);
      }
    }
    if (currencyItem.rates.length > 0) {
      results.push(currencyItem);
    }
  }

  return results;
};