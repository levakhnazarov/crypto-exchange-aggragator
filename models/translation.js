 'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {
  var Translation = sequelize.define('Translation', {
    lang: DataTypes.STRING,
    identifier: DataTypes.STRING,
    phrase: DataTypes.STRING
  }, {
    underscored: true,
  });
  Translation.associate = function(models) {
    // associations can be defined here
  };

  Translation.getMeta = function (prefix) {
    var fields = [
      '_META_TITLE', 
      '_META_KEYWORDS', 
      '_META_DESCRIPTION', 
      '_META_HEADING', 
      '_META_SUBHEADING',
      '_META_CONTENT'
    ];
    return this.findAll({
      where: {
        identifier: {
          [Op.in]: fields.map(field => [prefix.toUpperCase(), field].join(''))
        }
      }
    })
  };
  Translation.setMeta = function (prefix, data) {
    return this.getMeta(prefix.toUpperCase()).then(items => {
      // return items
      return items.map(item => {
        if (typeof data[item.identifier] !== 'undefined') {
          item.phrase = data[item.identifier];
          item.save();
        }
        return item;
      });
    });
  };
  Translation.REDIS_CHANNEL__UPDATE = 'translation-update';
  Translation.updateByIdentifier = function (identifier, phrase) {
    return Translation.update({ phrase: phrase }, {
      where: {
        identifier: identifier
      }
    })
  };
  Translation.upsert = function(values, condition) {
      return Translation
          .findOne(
              { where:
                      {
                  identifier: condition
              } })
          .then(function(obj) {
              if(obj) { // update
                  return obj.update(values);
              }
              else { // insert
                  return Translation.create(values);
              }
          })
  };
  return Translation;
};