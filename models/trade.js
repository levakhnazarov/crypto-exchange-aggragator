'use strict';
module.exports = (sequelize, DataTypes) => {
  var Trade = sequelize.define('Trade', {
    exchanger: DataTypes.STRING,
    currency: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    filled_amount:   DataTypes.DECIMAL,
    closed: DataTypes.BOOLEAN,
    txid: DataTypes.STRING,
    exchange_order_id: DataTypes.STRING,
    public_order_id: DataTypes.STRING

  }, {
    underscored: true,
  });
    Trade.associate = function(models) {
    // associations can be defined here
  };

  return Trade;
};