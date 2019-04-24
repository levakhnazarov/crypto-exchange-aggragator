'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pair = sequelize.define('Pair', {
    currencies: DataTypes.TEXT
  }, {
    underscored: true,
  });
  Pair.associate = function(models) {
    // associations can be defined here
  };
  Pair.TRANSLATION_PREFIX = {
    META__TITLE: 'PAIR__{id}__META__TITLE',
    META__KEYWORDS: 'PAIR__{id}__META__KEYWORDS',
    META__DESCRIPTION: 'PAIR__{id}__META__DESCRIPTION',
    PAGE__TITLE: 'PAIR__{id}__PAGE__TITLE',
    PAGE__SUBTITLE: 'PAIR__{id}__PAGE__SUBTITLE',
    SEO__TITLE: 'PAIR__{id}__SEO__TITLE',
    SEO__CONTENT: 'PAIR__{id}__SEO__CONTENT'
  };
  Pair.prototype.getMetaTitle = function () {
    return Pair.TRANSLATION_PREFIX.META__TITLE.replace('{id}', this.id) 
  };
  Pair.prototype.getMetaKeywords = function () {
    return Pair.TRANSLATION_PREFIX.META__KEYWORDS.replace('{id}', this.id) 
  };
  Pair.prototype.getMetaDescription = function () {
    return Pair.TRANSLATION_PREFIX.META__DESCRIPTION.replace('{id}', this.id) 
  };
  Pair.prototype.getPageTitle = function () {
    return Pair.TRANSLATION_PREFIX.PAGE__TITLE.replace('{id}', this.id) 
  };
  Pair.prototype.getPageSubtitle = function () {
    return Pair.TRANSLATION_PREFIX.PAGE__SUBTITLE.replace('{id}', this.id) 
  };
  Pair.prototype.getSeoTitle = function () {
    return Pair.TRANSLATION_PREFIX.SEO__TITLE.replace('{id}', this.id) 
  };
  Pair.prototype.getSeoContent = function () {
    return Pair.TRANSLATION_PREFIX.SEO__CONTENT.replace('{id}', this.id) 
  };
  Pair.REDIS_CHANNEL__UPDATE = 'pair-update';

  Pair.prototype.checkMatch = function (from, to) {
    if (this.currencies == '*') return 0
    return this.currencies.split(',').reduce((match, pair) => {
      var parts = pair.split('-')
      var matchFrom = parts[0].split('|').reduce((matchFrom, currency) => {
        if (currency == '*') {
          matchFrom = 1
        } else if(currency == from) {
          matchFrom = 2
        }
        return matchFrom
      }, false)

      var matchTo = parts[1].split('|').reduce((matchTo, currency) => {
        if (currency == '*') {
          matchTo = 1
        } else if(currency == to) {
          matchTo = 2
        }
        return matchTo
      }, false)
      
      if (matchFrom && matchTo) {
        var matchFinal = matchFrom + matchTo
        if (matchFinal > match) {
          match = matchFinal
        }
      }
      return match
    }, false)
  }

  return Pair;
};