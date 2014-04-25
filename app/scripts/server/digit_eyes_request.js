'use strict';
//var upc = '082347727444',

var crypto = require('crypto');
//hmac.update(upc);
//hmac.update(auth_key);
//console.log(hmac.digest('base64'));
/*genera lo url pere la richiesta a digit_eyes
@param upc:string codice upc o ean da ricercare
@return string*/
exports.get_digit8_request = function(upc){
    var auth_key = require('./../constants').auth_key,//Lg43Y4d1b8Ao9Jh4',
        app_key = require('./../constants').app_key ///69f17cUgG8G';
    var hmac = crypto.createHmac('sha1',auth_key);  
    hmac.update(upc);
    var signature = hmac.digest('base64');
    var out = "http://digit-eyes.com/gtin/v2_0/?upc_code="+upc+"&app_key="+app_key+"&signature="+signature+"&language=it&field_names=description,brand,nutrition,image,website,categories";
    return out;
};

exports.testing = function(){
    var out = { website: 'www.gimahhot.de/',
  description: 'Microsoft ZJA-00006 Arc Mouse',
  brand: 'testing',
  upc_code: '0882224730037',
  nutrition: null,
  image: 'http://www.gimahhot.de/images/products_small/499/4990168/microsoft-zja-00006-arc-mouse.jpg' };
    console.log('returning test');
    console.log(out);
    return out;
    
};
exports.doRequest = function(url,next){
    var request = require('superagent');
    console.log('requesting digit-eyes');
    request.get(url).end(function(err,res){
        if (err) { console.log('error');
            throw err;}
        else{
            console.log('callback di dorequest');
            next(res);
            }
    })
}