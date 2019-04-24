var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;

var app = express();
require('../helpers/translate')(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index.js'));
app.use('/langs', require('./routes/langs.js'));
app.use('/meta', require('./routes/meta.js'));
app.use('/faq', require('./routes/faq.js'));
app.use('/reviews', require('./routes/reviews.js'));
app.use('/pairs', require('./routes/pairs.js'));
// console.log()

app.listen(PORT, function () {
  console.log('Admin app listen on port ' + PORT)

});