'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lang: {
        type: Sequelize.STRING,
        references: {
          model: 'Langs',
          key: 'iso'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      identifier: {
        type: Sequelize.STRING
      },
      phrase: {
        type: Sequelize.TEXT
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
    }).then(() => {
      return queryInterface.addIndex('Translations', ['identifier']);
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Translations');
  }
};