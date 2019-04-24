var express = require('express');
var router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const Faq = models.Faq
const Translation = models.Translation;
const pub = models.redisCli;



router.get('/', (req, res, next) => {
  Faq.list().then(qas => {
    res.render('faq/index', {
      sections: Faq.SECTIONS_TRNASLATION_ID,
      qas: qas
    })    
  })
})

router.get('/add', (req, res, next) => {
  Faq.findById(req.params.id).then(item => {
    res.render('faq/form', {
      item: null,
      sections: Faq.SECTIONS_TRNASLATION_ID
    })
  })
})

router.post('/add', (req, res, next) => {
  Faq.create({ section: req.body.section, sort: req.body.sort }).then(item => {
    Translation.bulkCreate([
      { lang: 'en', identifier: item.getQuestionTranslId(), phrase: req.body.q },
      { lang: 'en', identifier: item.getAnswerTranslId(), phrase: req.body.a },
    ]).then(() => {
      pub.publish(Faq.REDIS_CHANNEL__UPDATE, true);
      pub.publish(Translation.REDIS_CHANNEL__UPDATE, true);
      res.redirect('/faq#item-' + item.id)
    })
  })
})


router.get('/update/:id', (req, res, next) => {
  Faq.findById(req.params.id).then(item => {
    res.render('faq/form', {
      item: item,
      sections: Faq.SECTIONS_TRNASLATION_ID
    })
  })
})

router.post('/update/:id', (req, res, next) => {
  Faq.findById(req.params.id).then(async item => {
    item.section = req.body.section;
    item.sort = req.body.sort;
    await item.save()
    await Translation.update({
      phrase: req.body.q
    }, {
      where: {
        identifier: item.getQuestionTranslId()
      }
    })
    await Translation.update({
      phrase: req.body.a
    }, {
      where: {
        identifier: item.getAnswerTranslId()
      }
    })
    pub.publish(Faq.REDIS_CHANNEL__UPDATE, true);
    pub.publish(Translation.REDIS_CHANNEL__UPDATE, true);
    res.redirect('/faq#item-' + item.id)
  })
})


router.get('/delete/:id', (req, res) => {
  Faq.findById(req.params.id).then(async item => {
    await item.destroy();
    await Translation.destroy({
      where: {
        identifier: {
          [Op.in]: [item.getQuestionTranslId(), item.getAnswerTranslId()]
        }
      }
    })
    pub.publish(Faq.REDIS_CHANNEL__UPDATE, true);
    pub.publish(Translation.REDIS_CHANNEL__UPDATE, true);
    res.redirect('/faq')
  });
})


module.exports = router;
