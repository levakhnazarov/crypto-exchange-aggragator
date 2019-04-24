'use strict';
module.exports = (sequelize, DataTypes) => {
  var Rate = sequelize.define('Rate', {
    exchanger: DataTypes.STRING,
    currency_from: DataTypes.STRING,
    currency_to: DataTypes.STRING,
    rate: DataTypes.DECIMAL,
    min_amount: DataTypes.DECIMAL,
    max_amount: DataTypes.DECIMAL,
    withdrawal_fee: DataTypes.DECIMAL,
    reverse: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  Rate.associate = function(models) {
    // associations can be defined here
  };
  /**
   * Доступные пары валют для обмена
   * @return {[type]} [description]
   */
  Rate.pairs = function() {
    return sequelize.query([
      'SELECT `currency_from` as `from`, `currency_to` as `to`',
      'FROM `Rates` where `active` = true',
      'GROUP BY `currency_from`, `currency_to`'
      ].join(' '), 
    {
      type: sequelize.QueryTypes.SELECT
    })
  }



  Rate.singlePairOffersCount = function (from, to) {
      return Rate.findAndCountAll({where:{currency_from:from, currency_to:to}}).then(result=>{
        return result.count
      })
  }
  Rate.singlePairOffers = function (from, to, exchanger) {
    return sequelize.query([
      'SELECT `exchanger`, `rate`, `min_amount` as `min`, `max_amount` as `max`',
      'FROM `Rates`',
      'WHERE `currency_from` = :from AND `currency_to` = :to ',
      typeof exchanger === 'undefined' ? 'AND `updated_at` >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)' : '',
      typeof exchanger !== 'undefined' ? 'AND `exchanger` = :exchanger' : '',
      'ORDER BY `rate` DESC'
      ].join(' '), 
    {
      replacements: { from: from, to: to, exchanger: exchanger },
      type: sequelize.QueryTypes.SELECT
    }).then(results => {
      return results.map(item => {
        item.rate = parseFloat(item.rate)
        item.min = parseFloat(item.min)
        item.max = parseFloat(item.max)
        return item
      })
    })
  }
  return Rate;
};