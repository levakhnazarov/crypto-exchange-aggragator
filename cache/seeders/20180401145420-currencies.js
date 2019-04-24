'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Currencies', [
      {ticker: 'btc', name: 'Bitcoin', price_usd: 7503.90},
      {ticker: 'eth', name: 'Ethereum', price_usd: 414.72},
      {ticker: 'xrp', name: 'Ripple', price_usd: 0.542718},
      {ticker: 'bch', name: 'Bitcoin Cash', price_usd: 715.46},
      {ticker: 'ltc', name: 'Litecoin', price_usd: 135.78},
      {ticker: 'eos', name: 'EOS', price_usd: 6.07},
      {ticker: 'ada', name: 'Cardano', price_usd: 0.168619},
      {ticker: 'xlm', name: 'Stellar', price_usd: 0.234447},
      {ticker: 'neo', name: 'Neo', price_usd: 53.30},
      {ticker: 'miota', name: 'IOTA', price_usd: 1.10},
      {ticker: 'xmr', name: 'Monero', price_usd: 190.61},
      {ticker: 'dash', name: 'Dash', price_usd: 341.02},
      {ticker: 'usdt', name: 'Tether', price_usd: 1},
      {ticker: 'trx', name: 'TRON', price_usd: 0.034623},
      {ticker: 'xem', name: 'NEM', price_usd: 0.250184},
      {ticker: 'etc', name: 'Ethereum Classic', price_usd: 15.18}
    ], {});
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Currencies', null, {})
  }
};
