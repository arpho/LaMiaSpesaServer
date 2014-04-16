// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID'		: '494748670648076', // your App ID
		'clientSecret'	: 'e7c4cdc433df2cd8e7bfc03c5124984c', // your App Secret
		'callbackURL'	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey'		: 'your-consumer-key-here',
		'consumerSecret'	: 'your-client-secret-here',
		'callbackURL'		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID'		: '1071294086929-f3iarlh2c1saofa28f0vpbr9658fbrbj.apps.googleusercontent.com',
		'clientSecret'	: 'BBcrRHwwdnIVDujEbnanH13C',
		'callbackURL'	: 'http://localhost:8080/auth/google/callback'
	}

};