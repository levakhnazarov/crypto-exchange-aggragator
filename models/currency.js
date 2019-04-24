'use strict';
const { Op } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  var Currency = sequelize.define('Currency', {
    ticker: DataTypes.STRING,
    name: DataTypes.STRING,
    logo_type: DataTypes.INTEGER,
    logo_src: DataTypes.STRING,
    explorer: DataTypes.STRING,
    price_usd: DataTypes.DECIMAL,
    change_1h_pct: DataTypes.DECIMAL,
    change_1h_usd: DataTypes.DECIMAL,
    change_24h_pct: DataTypes.DECIMAL,
    change_24h_usd: DataTypes.DECIMAL,
    change_7d_pct: DataTypes.DECIMAL,
    change_7d_usd: DataTypes.DECIMAL,
    has_tag: DataTypes.BOOLEAN,
    sort: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Currency.associate = function(models) {
    // associations can be defined here
  };
  Currency.hasAdditionalField = function(ticker){
      return new Promise(function(resolve, reject) {
          Currency.findOne({
              where: {ticker: ticker}
          }).then(coin => {
              return resolve(coin.hasTag())

          }).catch(e => {
                  return reject(e)
          })
      })
  };
  Currency.available = function (from, to) {
    return sequelize.query([
        'SELECT distinct a.`ticker`, a.`name`, a.`price_usd` as `usd` FROM `Currencies` a',
        'join `Rates` b on a.`ticker` = b.`currency_from` or a.`ticker` = b.`currency_to`',
        'where b.`active` = true'
      ].join(' '),
    {
      type: sequelize.QueryTypes.SELECT
    }).then(results => {
      return results.map(item => {
        item.usd = parseFloat(item.usd)
        return item
      })
    })
  };

  Currency.countAvailable = function() {
      return sequelize.query([
          'SELECT count(distinct a.ticker) as `count` FROM `Currencies` a',
          'join `Rates` b on a.`ticker` = b.`currency_from` or a.`ticker` = b.`currency_to`'
      ].join(' '),
          {
              type: sequelize.QueryTypes.SELECT
          }).then(result => {

          return result[0].count
      })
  };
  Currency.getFullNameByTicker = function(ticker){

      return new Promise(function(resolve, reject) {
          Currency.findOne({
              where: {ticker: ticker}
          }).then(coin => {
            return resolve(coin.getFullName())

          })
              .catch(e => {
                return reject(e)

              })
      })
  };

    Currency.getPriceUsdByTicker = function(ticker){

        return new Promise(function(resolve, reject) {
            Currency.findOne({
                where: {ticker: ticker}
            }).then(coin => {
                return resolve(coin.price_usd)

            })
                .catch(e => {
                    return reject(e)

                })
        })
    };

    Currency.getFullNameReverseByTicker = function(ticker){

    return new Promise(function(resolve, reject) {
        Currency.findOne({
            where: {ticker: ticker}
        }).then(coin => {
            return resolve(coin.getFullNameReverse())

        })
            .catch(e => {
                return reject(e)

            })
    })
    };
Currency.getNameByTicker = function(ticker){

    return new Promise(function(resolve, reject) {
        Currency.findOne({
            where: {ticker: ticker}
        }).then(coin => {
            return resolve(coin.getName())

        })
            .catch(e => {
                return reject(e)

            })
    })
};
Currency.getTickerByTicker = function(ticker){

    return new Promise(function(resolve, reject) {
        Currency.findOne({
            where: {ticker: ticker}
        }).then(coin => {
            return resolve(coin.getTag())

        })
            .catch(e => {
                return reject(e)

            })
    })
};

Currency.getSimilarPromoByTicker = function(ticker,charAt){
    return new Promise(function(resolve, reject) {
        Currency.findOne({
            where: {

                ticker: {
                    [Op.like]: '%'+ticker.charAt(charAt)+'%'
                }
            },
            order: [
                ['price_usd', (charAt === 0) ? 'DESC' : 'ASC'],
            ]
        }).then(coin => {
            return resolve({ticker:coin.ticker, name: coin.getFullName()})

        })
            .catch(e => {
                return reject(e)

            })
    })
}
Currency.getPromoPairs = function(ticker, count) {
    return new Promise(async function(resolve, reject){
        return sequelize.query(
            ['SELECT `a`.`currency_from` as `ticker`, max(`a`.`rate`) as `rate` FROM `Rates` `a` where `a`.`currency_to` = :ticker',
                'and `a`.`active` = true group by `a`.`currency_from` order by max(`a`.`rate`) desc limit :limit']
            .join(' '),
            {
                replacements: { ticker: ticker, limit : count },
                type: sequelize.QueryTypes.SELECT
            }).then(async result => {
                var results = []
                for (var i = 0;i<result.length;i++){
                    let resp = await Currency.getFullNameByTicker(result[i].ticker)
                    let priceUsd = await Currency.getPriceUsdByTicker(result[i].ticker)
                    results.push({ticker:result[i].ticker, name: resp, usd: priceUsd})
                }
            resolve( results )
        }).catch(e=>{
            reject (e)
        })
    })
};

Currency.getFullNameByTicker = function(ticker){
    return new Promise(function(resolve, reject) {
        Currency.findOne({
            where: {
                ticker:ticker
            }})
            .then(coin=>{
                resolve(coin.getFullName())
            })
            .catch(e=>{
                reject(e)
            })
    })
}
Currency.getNameByTicker = function(ticker){
    return new Promise(function(resolve, reject) {
        Currency.findOne({
            where: {
                ticker:ticker
            }})
            .then(coin=>{
                resolve(coin.getName())
            })
            .catch(e=>{
                reject(e)
            })
    })
}



Currency.prototype.getFullName = function () {
return [this.name, ' (', this.ticker.toUpperCase(), ')'].join('')
}
Currency.prototype.getFullNameReverse = function () {
    return [ ' (', this.ticker.toUpperCase(), ') ', this.name].join('')
}
Currency.prototype.getName = function () {
return this.name
}
Currency.prototype.getTag = function () {
return this.ticker
}
Currency.prototype.hasTag = function () {
return this.has_tag
}
  return Currency;
};