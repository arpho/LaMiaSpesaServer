'use strict';
var test = require('tap').test;
var request = require('superagent');
test('get-item should respond with an item in our db',function(t){
    var url = "http://localhost:8080/get_item?up=7313468675004";
    request.get(url).end(function(err,res){
        console.log(res.body);
        t.end();
    })
})
