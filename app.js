var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var config = require('config');
var http = require('http');
var slashes = require("connect-slashes");
// var markdown = require('markdown').markdown;
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
var Raven = require('raven');
// var users = require('./routes/users');
// var apiV1Currencies = require('./routes/api/v1/currencies');
// var rev = require('express-rev');
var app = express();

// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

Raven.config('https://f2609809dd7a42bba604d3f2dda1a650@sentry.io/1242397').install();

// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());
// app.use(slash());
require('./helpers/reviews')(app);
require('./helpers/faq')(app);
require('./helpers/translate')(app);
require('./helpers/pairs')(app);

var moment = require('moment');
moment.locale('en');
app.locals.moment = moment;

// view engine setup
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'pug');
// if (app.get('env') === 'development') {
  app.locals.pretty = true;
// }
// app.use(rev({
//   manifest: './public/assets/rev-manifest.json',
//   prepend: '/assets'
// }))

app.use(Raven.errorHandler());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'), { redirect : false }));
app.use(slashes(false))

// app.locals.fuck = true
// const CurrenciesCacheClass = require('./cache/currencies-cache')
// const CurrenciesCache = new CurrenciesCacheClass()
// CurrenciesCache.on('update', function(models) {
//   app.locals.currencies = models
// })
// const translations = new (require('./cache/translations'))();
// const RatesCache = new RatesCacheClass()
// RatesCache.on('update', function(models) {
//   // console.log(models)
//   app.locals.rates = models
// })

// app.locals.t = (identifier, md =  false, replace = {}) => translations.translate(identifier, md, replace);
// app.locals.md = markdown.toHTML

app.use(function (req, res, next) {
  // res.currencies = CurrenciesCache.getList()
  // res.rates = RatesCache.getList()
  res.locals.lang = req.hostname.split('.')[0];


    if(req.headers['x-forwarded-proto']==='http') {
        var host = app.get('env') === 'development' ? 'localhost:3000':req.headers.host;
        return res.redirect('https://' + host + req.url);
    }

    if(req.headers.host === "fast-waters-23860.herokuapp.com"){
        return res.redirect('https://smartjex.com');
    }

  next()
});


app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/exchange', require('./routes/exchange'));
app.use('/rates', require('./routes/rates'));
app.use('/track', require('./routes/track'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('404');
});



module.exports = app;
