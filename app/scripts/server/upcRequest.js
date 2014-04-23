'use strict';

module.exports = function (http,upc){
	
	var upc_ApiKey  = "b5c16ab4a289f6bb9b462a99802d996d",
	url = "http://upcdatabase.org/api/json/"+upc_ApiKey+'/'+upc,
        request = require('superagent');
	options = {
	  host: 'http://upcdatabase.org/api/json/'+upc_ApiKey+'/'+upc,
	  port: 80
	  
	};
    request.get(url).end(function(err, res){
  if (err) throw err;
  console.log(res.text);
});
	console.log('upc request ');
	http.get(url,function(resp){
	console.log('got response '+resp.statusCode);
	console.log('###########################################################################################');
	//console.log(resp);
	for (var key in resp){console.log(key);}
	console.log('##########################################################################################');
	console.log(resp.connection.parser);
	console.log(url);
	return(resp);
	}).on("error", function(e){
  console.log("Got error: " + e.message);

	});
	};

module.exports.digit8_request = function (req,Res,next){
    /*makes the request to digit_eys andreturn the retrivied_item */
    var upc = req.query.upc;
    console.log('looking for '+upc);
    var buildUrl = require('./digit_eyes_request').get_digit8_request;
    var url = buildUrl(upc);
    console.log(url);
    var request = require('superagent');
    request.get(url).end(function(err,res){
    console.log('callback di digi8');
    if (err) throw err;
        var item;
    //Res.send(res.text);
    var item = res.text;
    console.log(res.text);
    next(item);
};
);
    
}