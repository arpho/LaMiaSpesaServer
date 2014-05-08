"use strict";
var test = require('tap').test,
request = require('superagent');

test('withouth token should not work',function(t){
    var url = "http://localhost:8080/get_weighed?upc=2047960000822";
    request.get(url).end(function(err,res){
        t.equal(false,res.ok,'no token')
        t.end();
    })
})

test( 'after the login should work',function(t){
    
    var  url = "http://localhost:8080/api_authentication",
        token;
    request.post(url).send("email=damicogiuseppe77@gmail.com").send("password=vilu7240").end(function(res){
    //console.log('the server sent')
    if (res.ok) {
        token = res.body.token;
        url = "http://localhost:8080/get_weighed?upc=2047960000822?token="+token;
        request.get(url).end(function(err,res){
        //t.equal(true,res.body.token,'si token')
        t.end();
    })
     } else {
       console.log('Oh no! error ' + res.text);
     }
});
    
    
    
})
    
