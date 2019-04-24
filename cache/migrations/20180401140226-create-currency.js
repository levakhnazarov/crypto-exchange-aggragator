'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticker: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      logo_type: {
        type: Sequelize.INTEGER
      },
      logo_src: {
        type: Sequelize.STRING
      },
      price_usd: {
        type: Sequelize.DECIMAL(13, 6)
      },
      change_1h_pct: {
        type: Sequelize.DECIMAL(6, 2)
      },
      change_1h_usd: {
        type: Sequelize.DECIMAL(6, 2)
      },
      change_24h_pct: {
        type: Sequelize.DECIMAL(6, 2)
      },
      change_24h_usd: {
        type: Sequelize.DECIMAL(6, 2)
      },
      change_7d_pct: {
        type: Sequelize.DECIMAL(6, 2)
      },
      change_7d_usd: {
        type: Sequelize.DECIMAL(6, 2)
      },
      sort: {
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
    return queryInterface.dropTable('Currencies');
  }
};