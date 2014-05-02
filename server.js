'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path'),
    fs = require('fs');
var passport = require('passport');
var flash    = require('connect-flash');
var neo = require('neo4j');
var db = new neo.GraphDatabase('http://localhost:7474');
//var db = new neo4j.GraphDatabase('http://localhost:7474');
var neoDb = new neo.GraphDatabase('http://localhost:7474');
var app = express();

// Connect to database
var db = require('./lib/db/mongo');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Populate empty DB with dummy data
//require('./lib/db/dummydata');

// Controllers
var api = require('./lib/controllers/api');
// Express Configuration
app.configure(function(){
    app.use('/media', express.static(__dirname + '/media'));
    app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	//app.use( express.static( "public" ) );
    //for authentication
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
    app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
});

app.configure('development', function(){
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  //app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

// Routes
app.get('/api/awesomeThings', api.awesomeThings);
require('./app/config/passport')(passport,neoDb);
require('./app/routes.js')(app, passport,neo,neoDb); // load our routes and pass in our app and fully configured passport

// Start server
var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});