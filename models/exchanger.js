'use strict';
module.exports = (sequelize, DataTypes) => {
  var Exchanger = sequelize.define('Exchanger', {
    uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    logo: DataTypes.STRING
  }, {
    underscored: true,
  });
  Exchanger.associate = function(models) {
    // associations can be defined here
  };
  return Exchanger;
};