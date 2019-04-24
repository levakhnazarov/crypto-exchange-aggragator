var changelly = require('../lib/changelly');
const models = require('../../models');

var api = new changelly( models.conf.api.changelly.apiKey, models.conf.api.changelly.secret )

api.getCurrencies(async function (err, currencies) {
    console.log(err)
    console.log(currencies)


})