var express = require('express');
var app = express();
var db = require("./db.js");

// set Template Engine
app.set('view engine', 'jade');
app.set('views', './views');

// serving static files
app.use('/s', express.static('static'));

app.get('/', function(req, res) {
  res.render('searchMain');
})
var se = require('./handlers/searchHandler.js');
se.setDatabase(db);
app.get('/search/*', se.handler)

// set Error Handler
app.use(require('./handlers/errorHandler.js'));

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
db.parseCSVAndInsert();
setInterval(db.parseCSVAndInsert, 1000 * 5);
