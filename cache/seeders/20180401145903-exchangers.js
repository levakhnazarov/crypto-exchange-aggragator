'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Exchangers', [
      {uuid: 'alpha', name: 'Alpha'},
      {uuid: 'beta', name: 'Beta'},
      {uuid: 'gamma', name: 'Gamma'}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Exchangers', null, {});
  }
};
