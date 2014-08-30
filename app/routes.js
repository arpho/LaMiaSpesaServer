module.exports = function(app, passport,neo,db) {
    var tList = require('./scripts/utility/token_list') // perchè tutti moduli delrouting lavorino con la stessa lista di token la distribuisco a tutti da qua

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});
    app.get('/isAlive',function(req,res){
        var token = req.query.token;
        var alive = tList.isValid(token)
        console.log("token "+token+" is alive "+alive )
        res.json({result:alive});
    })

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: 'introduci le tue credenziali' }); 
	});
    app.post('/api_login',
             function(req,res,next){
                 console.log('api_login in routes')
                 console.log(req.session);
                 //console.log(req.body);
                 var user = require('../lib/models/neo4j').user,
                User = new user(db),
                email = req.query.username,
                password  = req.query.password,
                tList = require('./scripts/utility/token_list');
                 
                 User.methods.findOne(email,function(err,user){
                     console.log('found user')
                     var token = require('./scripts/utility/token').token,
                      Token;
                     if (valid){
                          Token = new token(user,'api-local');
                         req.login(); // stabilisce una sessione
                         console.log('created token');
                         tList.addToken(Token);
                         console.log('token added');
                         res.json({sessionToken:Token.get_token()})
                     }
                 })
                 console.log(email,password),
                     bcrypt = require('bcrypt-nodejs'),
                     cryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                 console.log('password: '+cryptedPassword);
                res.send(req.user); 
             });
  /*  app.post('/api_login_recover',function(req, res, next) {
        console.log('prima callback')
  passport.authenticate('api-login', function(err, user, token) { // funzione invocata da passport come done
      console.log("done  callback")
      console.log('user');
      console.log(user);
      console.log('token')
      console.log(token)
      res.json({token:token})
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
  })(req, res, next);
});*/
    app.post('/api_authenticate', 
  passport.authenticate('localapikey', { failureRedirect: '/api/unauthorized' }),
  function(req, res) {
      console.log('route apikey')
      console.log(req.session);
    res.json({ message: "Authenticated" })
  });
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
        failureFlash: 'Invalid username or password.',
        successFlash: 'Welcome!',
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : false // allow flash messages
	}));
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: 'registrazione' });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : false // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
        
        console.log(req.session);
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
    
    // =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	
	

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));
		
	// =====================================
	// GOOGLE ROUTES =======================
	// =====================================
	// send to google to do the authentication
	// profile gets us their basic information including their name
	// email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    
    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    success : '/profile',
                    failureRedirect : '/'
            }));

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
 
	// =====================================
	// API_AUTHENTICATION ==============================
	//   
    app.post('/api_authentication',function(req,res){
        console.log(req.query)
        var token = require('./scripts/utility/token').token,
            email = req.query.email,
            password = req.query.password,
            user = require('../lib/models/neo4j').user,
            User = new user(db);
            console.log(email);
        console.log(password);
        User.methods.findOne(email,function(err,user){
            if (err) throw err;
            else{
                    
                    
                    if(User.methods.validPassword(password)){
                        console.log('password ok')
                        var 
                            token = require('./scripts/utility/token').token,
                            Token = new token(user,'api_local')
                        res.json({sesionToken:Token.get_token()})
                        tList.addToken(Token);
                        
                        console.log('done')}
                else{
                    console.log("not authorized routes.js 170")
                    res.send(401);
                }
            }
        })
        
    })

	// =====================================
	// LOOKING_ITEM ==============================
	// =====================================
	app.get('/get_weighed',function(req,res){require('./scripts/routing/weighed').route(req,res,db);});
	app.get('/get_item',function(req,res){
        require('./scripts/routing/get_item').route2(req,res,db,tList);
    });
	app.get('/api/looking_item',function(req,res){ // just for testing and developement
		//var upc_number = req.query.upc,
		//http = require('http');
        require('./scripts/server/upcRequest').digit8_request(req,res);
		//res.json(require('./scripts/server/upcRequest')(http,upc_number));
		//res.send(req);
	});
};
module.exports.isTokenValid = function(t){
    var tList = require('./scripts/utility/token_list')
    return tList.isValid(t);
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}