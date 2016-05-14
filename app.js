var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var innkeeper = require('./innkeeper');
var innkeeper_gold = require('./innkeeper_gold');
var port = process.env.PORT || 3000;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// get route for index
app.get('/', function (req, res) { res.status(200).send('Hello, I\'m the Innkeeper!<br> Follow the readme to figure out how to make calls against me in slack!') });

// card post route
app.post('/get_card', innkeeper);

// default-gold card post route
app.post('/get_gold_card', innkeeper_gold);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Innkeeper Slackbot listening on port ' + port);
});