'use strict';
module.exports = (sequelize, DataTypes) => {
  var Faq = sequelize.define('Faq', {
    section: DataTypes.INTEGER,
    sort: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Faq.associate = function(models) {
    // associations can be defined here
  };
  Faq.SECTIONS_TRNASLATION_ID = {
    1: 'FAQ__SECTION__STEP_1__TITLE',
    2: 'FAQ__SECTION__STEP_2__TITLE',
    3: 'FAQ__SECTION__STEP_3__TITLE',
  };
  Faq.TRANSLATION_PREFIX = {
    QUESTION: 'FAQ__QUESTION__',
    ANSWER: 'FAQ__ANSWER__'
  };
  Faq.prototype.getQuestionTranslId = function () {
    return Faq.TRANSLATION_PREFIX.QUESTION + this.id
  };
  Faq.prototype.getAnswerTranslId = function () {
    return Faq.TRANSLATION_PREFIX.ANSWER + this.id
  };
  Faq.list = function(models) {

    return this.findAll({
      order: [['section', 'ASC'], ['sort', 'ASC']]
    });
  };
  Faq.REDIS_CHANNEL__UPDATE = 'faq-update';
  return Faq;
};