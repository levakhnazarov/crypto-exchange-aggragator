'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lang = sequelize.define('Lang', {
    iso: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true  
      }
    }
  }, {
    underscored: true,
  });
  Lang.associate = function(models) {
    // associations can be defined here
  };
  Lang.prototype.getFlagSrc = function () {
    return 'http://smartjex.me/resources/images/flags/' + this.iso + '.svg'
  }
  return Lang;
};