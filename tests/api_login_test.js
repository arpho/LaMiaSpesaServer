var test = require('tap').test;
var request = require('superagent');


var  url = "http://localhost:8080/api_authentication"
request.post(url).send("email=damicogiuseppe77@gmail.com").send("password=vilu7240").end(function(res){
    //console.log('the server sent')
    if (res.ok) {
       console.log('yay got ' + JSON.stringify(res.body));
     } else {
       console.log('Oh no! error ' + res.text);
     }
})