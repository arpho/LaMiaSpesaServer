module.exports = function(app, passport,neo) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: 'introduci le tue credenziali' }); 
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
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
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
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
	// LOOKING_ITEM ==============================
	// =====================================
	
	app.get('/get_item',function(req,res){
		var upc_number = req.query.upc;
		//console.log(upc_number);
		var query = "MATCH (i:lms_item{number:'"+upc_number+"'}) RETURN i";
        //var Item = {itemname:'item non presente',description:'item non ancora presente nel nostro database'};
		neo.cypherQuery(query,function(err,item){
			if(err){throw err;}
			else{
				//console.log(item);
				var query = "MATCH (i:lms_item{number:'"+upc_number+"'})-[lms_visualizes]-(p:lms_picture) RETURN p";
				neo.cypherQuery(query,function(err,pics){
					if(err){throw err;}
					else{
						//console.log(pics.data[0].data.name);
						item.pictures = pics.data;
                        if (pics.data.length>0){
                            item.data[0].data.pictures = pics.data[0].data.name;
                        }
                        //Item = item.data[0].data;
                          console.log('########################################################################################################################################');
                          console.log('looked for '+upc_number);
                          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                        
						//console.log(pics.data.length);
                        if(item.data.length>0){
                            var Item = item.data[0].data
						  res.json();
                        }
                        else{
                            var Item = {itemname:'not found',description:'item not present in our db'};
                        }
                        res.json(Item);
                        console.log("answer sent:");
                        console.log(Item);
						//res.redirect('pictures.ejs',item);
				
						}
				});
				}
		});
	});
	app.get('/api/looking_item',function(req,res){
		var upc_number = req.query.upc,
		http = require('http');
		res.json(require('./scripts/server/upcRequest')(http,upc_number));
		//res.send(req);
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}