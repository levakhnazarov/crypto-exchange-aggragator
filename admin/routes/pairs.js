var express = require('express');
var router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const Pair = models.Pair
const Translation = models.Translation



if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var pub = require("redis").createClient(rtg.port, rtg.hostname);

    pub.auth(rtg.auth.split(":")[1]);
} else {
    var pub = require("redis").createClient();
}



router.get('/', (req, res, next) => {
  Pair.findAll().then(items => {
    res.render('pairs/index', {
      items: items
    })    
  })
});

router.get('/add', (req, res, next) => {
  res.render('pairs/form', {
    item: null
  })
});

router.post('/add', (req, res, next) => {
  Pair.create({ currencies: req.body.currencies }).then(item => {
    Translation.bulkCreate([
      { lang: 'en', identifier: item.getMetaTitle(), phrase: req.body.meta_title },
      { lang: 'en', identifier: item.getMetaKeywords(), phrase: req.body.meta_keywords },
      { lang: 'en', identifier: item.getMetaDescription(), phrase: req.body.meta_description },
      { lang: 'en', identifier: item.getPageTitle(), phrase: req.body.page_title },
      { lang: 'en', identifier: item.getPageSubtitle(), phrase: req.body.page_subtitle },
      { lang: 'en', identifier: item.getSeoTitle(), phrase: req.body.seo_title },
      { lang: 'en', identifier: item.getSeoContent(), phrase: req.body.seo_content },
    ]).then(() => {
      pub.publish(Pair.REDIS_CHANNEL__UPDATE, true);
      pub.publish(Translation.REDIS_CHANNEL__UPDATE, true);
      res.redirect('/pairs#pair-' + item.id)
    })
  })
});

router.get('/update/:id', (req, res, next) => {
  Pair.findById(req.params.id).then(item => {
    res.render('pairs/form', {
      item: item
    })
  })
});

router.post('/update/:id', (req, res, next) => {
  var data = req.body
  Pair.findById(req.params.id).then(async item => {
    item.currencies = data.currencies
    await item.save()
    await Translation.updateByIdentifier(item.getMetaTitle(), data.meta_title)
    await Translation.updateByIdentifier(item.getMetaKeywords(), data.meta_keywords)
    await Translation.updateByIdentifier(item.getMetaDescription(), data.meta_description)
    await Translation.updateByIdentifier(item.getPageTitle(), data.page_title)
    await Translation.updateByIdentifier(item.getPageSubtitle(), data.page_subtitle)
    await Translation.updateByIdentifier(item.getSeoTitle(), data.seo_title)
    await Translation.updateByIdentifier(item.getSeoContent(), data.seo_content)
    pub.publish(Pair.REDIS_CHANNEL__UPDATE, true);
    pub.publish(Translation.REDIS_CHANNEL__UPDATE, true);
    res.redirect('/pairs#pair-' + item.id)
  })
});

router.get('/delete/:id', (req, res) => {
  Pair.findById(req.params.id).then(async item => {
    await item.destroy();
    await Translation.destroy({
      where: {
        identifier: {
          [Op.in]: [
            item.getMetaTitle(), 
            item.getMetaKeywords(),
            item.getMetaDescription(),
            item.getPageTitle(),
            item.getPageSubtitle(),
            item.getSeoTitle(),
            item.getSeoContent(),
          ]
        }
      }
    })
    pub.publish(Pair.REDIS_CHANNEL__UPDATE, true);
    pub.publish(Translation.REDIS_CHANNEL__UPDATE, true);
    res.redirect('/pairs')
  });
})

module.exports = router;
