'use strict';
module.exports = (sequelize, DataTypes) => {
  var Income = sequelize.define('Income', {
    exchanger: DataTypes.STRING,
    currency: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    closed: DataTypes.BOOLEAN,
    txid: DataTypes.STRING,
    order_id: DataTypes.STRING

  }, {
    underscored: true,
  });
    Income.associate = function(models) {
    // associations can be defined here
  };

  return Income;
};