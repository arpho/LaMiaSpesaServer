'use strict';

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User			= require('../../lib/models/user');
// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
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
	        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

				// if there is an error, stop everything and return that
				// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                // if there is no user found with that facebook id, create them
	                var newUser            = new User();

					// set all of the facebook information in our user model
	                newUser.facebook.id    = profile.id; // set the users facebook id	                
	                newUser.facebook.token = token; // we will save the token that facebook provides to the user	                
	                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

					// save our user to the database
	                newUser.save(function(err) {
	                    if (err){
	                        throw err;
						}
	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
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
			console.log('local strategy');
			User.findOne({ 'local.email' :  email },function(err,user){
            // if there are any errors, return the error
            if (err){
                return done(err);
               }
            // check to see if theres already a user with that email
            if (user) {
				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else{
				// if there is no user with that email
                // create the user
                var newUser = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
					if (err){ throw err;}
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
			console.log('local 132');
		User.findOne({ 'local.email' :  email },function(err,user){
			if (err){
				return done(err);
				}
			if (!user)
				{return done(null, false, req.flash('loginMessage', 'No user found.'));}
			if (!user.validPassword(password))
				{return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));}
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