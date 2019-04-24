let models = require( '../../../models/index');
var Sequelize = require('sequelize');
const Translate = models.Translate;
const Op = Sequelize.Op;

exports.getMainPageTranslates = function() {
  var mainPageTranslates = [
    'track_order_link_label', 'about_us_link_label', 'supported_coins_link_label', 'faq_link_label',
    'main_page_h1_1', 'main_page_h1_2', 'main_page_h2', 'main_page_fst_screen_placeholder_left',
    'main_page_fst_screen_placeholder_right', 'exсhange_button_label', 'main_page_fst_screen_more_offers_text_1',
    'main_page_fst_screen_more_offers_text_2', 'main_page_advantage_block_title',
    'main_page_advantage_block_item1_name', 'main_page_advantage_block_item1_text',
    'main_page_advantage_block_item2_name', 'main_page_advantage_block_item2_text',
    'main_page_advantage_block_item3_name', 'main_page_advantage_block_item3_text',
    'main_page_advantage_block_item4_name', 'main_page_advantage_block_item4_text',
    'main_page_partners_block_title'
  ];
  return Translate.findAll({
    where: {
      language: 'en',
      key: {
        [Op.in]: mainPageTranslates
      }
    }
  });
};