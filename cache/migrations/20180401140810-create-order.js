'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      exchanger: {
        type: Sequelize.STRING
      },
      api_id: {
        type: Sequelize.STRING
      },
      public_id: {
        type: Sequelize.STRING
      },
      payin_currency: {
        type: Sequelize.STRING
      },
      payout_currency: {
        type: Sequelize.STRING
      },
      rate: {
        type: Sequelize.DECIMAL(65, 30)
      },
      payin_amount: {
        type: Sequelize.DECIMAL(65, 30)
      },
      payin_amount_min: {
        type: Sequelize.DECIMAL(65, 30)
      },
      payout_amount: {
        type: Sequelize.DECIMAL(65, 30)
      },
      saved_pct: {
        type: Sequelize.DECIMAL(6, 2)
      },
      payin_address: {
        type: Sequelize.STRING
      },
      payin_address_ext: {
        type: Sequelize.STRING
      },
      payout_address: {
        type: Sequelize.STRING
      },
      payout_address_ext: {
        type: Sequelize.STRING
      },
      refund_address: {
        type: Sequelize.STRING
      },
      refund_address_ext: {
        type: Sequelize.STRING
      },
      progress: {
        type: Sequelize.INTEGER
      },
      error: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Orders');
  }
};