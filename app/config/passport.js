'use strict';

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
//var User			= require('../../lib/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport,db) {
    var user            = require('../../lib/models/neo4j').user,
    User = new user(db)  // instanzio lo user di neo4j

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serializing: ');
        console.log(user)
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        //console.log('deserializing: '+user);
        User.methods.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
	// code for login (use('local-login', new LocalStategy))
	// code for signup (use('local-signup', new LocalStategy))

	// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

		// pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function() {
			console.log('facebook strategy');
			// find the user in the database based on their facebook id
            /*console.log("facebook strategy profile")
            console.log(profile);*/
	        User.methods.findFb( profile.id , function(err, user) {

				// if there is an error, stop everything and return that
				// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                // if there is no user found with that facebook id, create them
	                var newUser            = {};

					// set all of the facebook information in our user model
                    profile.token = token;
                    console.log("no user so creating it")
                    // save our user to the database
                    var fbUser = {}
                    fbUser.fb_id = profile.id
                    fbUser.token = token;
                    fbUser.hometown = profile._json.hometown.name;
                    fbUser.location = profile._json.location.name;
                    fbUser.username = profile.username;
                    fbUser.email = profile.emails[0].value;// just the first one
                    fbUser.gender = profile.gender;
                    fbUser.name = profile.name.givenName;
                    fbUser.familyName = profile.name.familyName;
                    User.methods.createUser(fbUser,function(err,newUser){
                        if (err) throw err;
                        else{
                           /* console.log('callback create user')
                            console.log(newUser)*/
                        }
                    })
	                /*newUser.facebook.id    = profile.id; // set the users facebook id	                
	                newUser.facebook.token = token; // we will save the token that facebook provides to the user	                
	                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first*/

					
	                
	            }

	        });
        });

    }));
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup',new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done){
		process.nextTick(function(){
			console.log('local strategy for: '+email);
			User.methods.findOne(email,function(err,user){
            // if there are any errors, return the error
            if (err){
                return done(err);
               }
            // check to see if theres already a user with that email
            if (user) {
                console.log('mail già presente')
                console.log(user);
                req.flash('signupMessage', 'That email is already taken.')
				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else{
                // create the user
                var newUser = {};
                newUser.email    = email;
                newUser.password = User.methods.generateHash(password);
                console.log("creating newuser")
                console.log(newUser)
                User.methods.createUser(newUser,function(err,id) {
					if (err){ throw err;}
                    console.log(id)
                    newUser.id = id;
                    console.log('user created')
                    console.log(newUser);
                    return done(null, newUser);	
				});

            }
                
                });
		});
    }
    ));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, password, done){
		User.methods.findOne(email,function(err,user){
			if (err){
				return done(err);
                console.log('findone error')
				}
			if (!user)
				{   console.log("findone no user")
                    return done(null, false, req.flash('loginMessage', 'No user found.'));}
			if (!User.methods.validPassword(password))
				{   console.log("findone si user")
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));}
			// all is well, return successful user
            return done(null, user);

			
		});
    }));
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    
    passport.use(new GoogleStrategy({

        clientID        : '1071294086929-f3iarlh2c1saofa28f0vpbr9658fbrbj.apps.googleusercontent.com',
        clientSecret    : 'BBcrRHwwdnIVDujEbnanH13C',
        callbackURL     : 'http://localhost:8080/auth/google/callback'

    },function(token, refreshToken, profile, done){
		User.findOne({ 'google.id' : profile.id },  function(err, user) {
			console.log('google strategy');
			if(err) {
				return done(err);
			}
			if(user){
				return done(null, user);
			} else {
				var newUser          = new User();
				newUser.google.id    = profile.id;
	            newUser.google.token = token;
	            newUser.google.name  = profile.displayName;
	            
	            newUser.google.email = profile.emails[0].value; // pull the first email
	            newUser.save(function(err){
					if(err){throw err;}
					return done(null, newUser);
	            });
			} 
			
		});
    }));
    
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    

};