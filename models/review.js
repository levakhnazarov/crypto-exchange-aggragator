'use strict';
var { URL } = require('url');
module.exports = (sequelize, DataTypes) => {
  var Review = sequelize.define('Review', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    post_date: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true
      }
    }
  }, {
    underscored: true,
  });
  Review.associate = function(models) {
    // associations can be defined here
  };
  Review.list = function(models) {
    return this.findAll({
      order: [['sort', 'ASC']]
    });
  };
  Review.prototype.getService = function () {
    var url = new URL(this.url);
    var hostname = url.hostname
    var parts = hostname.split('.').filter(part => ['www', 'forum'].indexOf(part) === -1);
    if (parts.length > 0) {
      return parts[0]
    }
    return 'Unknown';
  };
  Review.REDIS_CHANNEL__UPDATE_REVIEWS = 'reviews-update';
  return Review;
};