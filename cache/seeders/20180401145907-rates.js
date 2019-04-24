'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Rates', [
      {exchanger: 'alpha', currency_from: 'btc', currency_to: 'eth', rate: 17.756076, min_amount: 0, max_amount: null},
      {exchanger: 'beta', currency_from: 'btc', currency_to: 'eth', rate: 17.749183, min_amount: 0.02, max_amount: 1.1},
      {exchanger: 'gamma', currency_from: 'btc', currency_to: 'eth', rate: 17.401900, min_amount: 0.00105, max_amount: 177.25175},

      {exchanger: 'alpha', currency_from: 'eth', currency_to: 'btc', rate: 0.055216, min_amount: null, max_amount: null},
      {exchanger: 'beta', currency_from: 'eth', currency_to: 'btc', rate: 0.055136, min_amount: 0.18, max_amount: 10},
      {exchanger: 'gamma', currency_from: 'eth', currency_to: 'btc', rate: 0.055127, min_amount: 0.01995, max_amount: 1430.32893},


      {exchanger: 'alpha', currency_from: 'btc', currency_to: 'xrp', rate: 13929.87463, min_amount: 0.00499, max_amount: null},
      {exchanger: 'beta', currency_from: 'btc', currency_to: 'xrp', rate: 14020.6040079, min_amount: 0.00180948, max_amount: 0.73847608},
      {exchanger: 'gamma', currency_from: 'btc', currency_to: 'xrp', rate: 13507.38785, min_amount: 0.00315, max_amount: 0.733179},

      {exchanger: 'alpha', currency_from: 'xrp', currency_to: 'btc', rate: 0.00007021, min_amount: 90, max_amount: null},
      {exchanger: 'beta', currency_from: 'xrp', currency_to: 'btc', rate: 0.00004924, min_amount: 44.000558, max_amount: 9832.042376},


      {exchanger: 'alpha', currency_from: 'eth', currency_to: 'xrp', rate: 769.803640, min_amount: 0.11, max_amount: null},
      {exchanger: 'beta', currency_from: 'eth', currency_to: 'xrp', rate: 767.5592984, min_amount: 0.03269880, max_amount: 13.21195351},
      {exchanger: 'gamma', currency_from: 'eth', currency_to: 'xrp', rate: 755.06189308, min_amount: 0.05394716, max_amount: 13.03165943},

      {exchanger: 'alpha', currency_from: 'xrp', currency_to: 'eth', rate: 0.00124994, min_amount: 90, max_amount: null},
      {exchanger: 'beta', currency_from: 'xrp', currency_to: 'eth', rate: 0.00126358, min_amount: 1.71603096, max_amount: 10313.65346611},
      {exchanger: 'gamma', currency_from: 'xrp', currency_to: 'eth', rate: 0.00123434, min_amount: 41.92872117, max_amount: 10188.86443046},

      {exchanger: 'alpha', currency_from: 'eos', currency_to: 'ada', rate: 35.38767825, min_amount: 20, max_amount: 1250},
      {exchanger: 'alpha', currency_from: 'eos', currency_to: 'eth', rate: 0.014577, min_amount: 0.14907893, max_amount: 840.84911177},

      {exchanger: 'alpha', currency_from: 'eth', currency_to: 'eos', rate: 67.264569, min_amount: 0.11, max_amount: null},

      {exchanger: 'gamma', currency_from: 'xrp', currency_to: 'btc', rate: 0.055127, min_amount: 0.01995, max_amount: 1430.32893},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Rates', null, {});
  }
};
