var test = require('tap').test;
var request = require('superagent').agent();


var  url = "http://localhost:8080/login"
request.post(url).send("email=damicogiuseppe77@gmail.com").send("password=vilu7240").end(function(res){
    console.log('connected to the server:',typeof(res.req._headers.cookie)!='undefined')
        console.log('res.body');
        console.log(res)
        console.log('res.body');
    
    
})

test('get-item should respond with an item in our db',function(t){
    var url = "http://localhost:8080/get_item?upc=7313468675004";
    request.get(url).end(function(err,res){
        console.log('res.body');
        console.log(res.body)
        console.log('res.body');
        
        t.end();
    })
})