'use strict';

var mongoose = require('mongoose');

exports.mongoose = mongoose;
var db = require('../../app/config/database');

// Configure for possible deployment
var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  db.url;

var mongoOptions = { db: { safe: true } };

// Connect to Database
mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uristring);
  }
});
