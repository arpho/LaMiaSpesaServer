var test = require('tap').test;
var request = require('superagent');


var  url = "http://localhost:8080/login"
request.post(url).send("email=damicogiuseppe77@gmail.com").send("password=vilu7240").end(function(res){
    console.log('the server sent')
    console.log('lot of think');
})