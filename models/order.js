'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    exchanger: DataTypes.STRING,
    api_id: DataTypes.STRING,
    public_id: DataTypes.STRING,
    payin_currency: DataTypes.STRING,
    payout_currency: DataTypes.STRING,
    rate: DataTypes.DECIMAL,
    payin_amount: DataTypes.DECIMAL,
    payin_amount_min: DataTypes.DECIMAL,
    payout_amount: DataTypes.DECIMAL,
    saved_pct: DataTypes.DECIMAL,
    filled_gain: DataTypes.DECIMAL,
    filled_rate: DataTypes.DECIMAL,
    filled_amount: DataTypes.DECIMAL,
    payin_address: DataTypes.STRING,
    payin_address_ext: DataTypes.STRING,
    payout_address: DataTypes.STRING,
    withdrawal_id: DataTypes.STRING,
    trade_id: DataTypes.STRING,
    payout_address_ext: DataTypes.STRING,
    refund_address: DataTypes.STRING,
    refund_address_ext: DataTypes.STRING,
    progress: DataTypes.INTEGER,
    txIdUrl: DataTypes.STRING,
    incomeTx: DataTypes.STRING,
    error: DataTypes.INTEGER,
    prepaid: DataTypes.BOOLEAN,
    reverse: DataTypes.BOOLEAN

  }, {
    underscored: true,
  });
  Order.associate = function(models) {
    // associations can be defined here
  };
  Order.prototype.getUrl = function () {
    return '/order/' + this.public_id
  }

  Order.getByPublicId = function(public_id){

    return Order.findOne({where: {public_id: public_id}})
  };
  Order.getByApiId = function(api_id){

      return Order.findOne({where: {api_id: api_id}})
  }

  Order.prototype.payInAmount = function () {
    return parseFloat(Number(this.payin_amount).toFixed(6))
  }

  Order.prototype.filledAmount = function () {
    return parseFloat(Number(this.filled_amount).toFixed(6))
  }

  Order.prototype.payInAmountMin = function () {
    return parseFloat(Number(this.payin_amount_min).toFixed(6))
  }

  Order.prototype.payOutAmount = function () {
    return parseFloat(Number(this.payout_amount).toFixed(6))
  }

  Order.prototype.getStep = function () {
    return this.progress + (this.error == 1 ? 0.5 : 0)
  }

  Order.prototype.getSaved = function () {
    return Number(this.saved_pct)
  }
  return Order;
};