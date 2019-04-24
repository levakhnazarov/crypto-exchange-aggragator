'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      exchanger: {
        type: Sequelize.STRING
      },
      currency_from: {
        type: Sequelize.STRING
      },
      currency_to: {
        type: Sequelize.STRING
      },
      rate: {
        type: Sequelize.DECIMAL(65, 30)
      },
      min_amount: {
        type: Sequelize.DECIMAL(65, 30)
      },
      max_amount: {
        type: Sequelize.DECIMAL(65, 30)
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Rates');
  }
};