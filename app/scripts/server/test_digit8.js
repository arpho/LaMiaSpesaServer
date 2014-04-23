'use strict';
var test = require('tap').test;
test("it works",function(t){

var get8 = require('./digit_eyes_request').get_digit8_request;
    t.equal("http://digit-eyes.com/gtin/v2_0/?upc_code=082347727444&app_key=/69f17cUgG8G&signature=D9EQd6vGr8EfrrQVfLoYBkNo3wA=&language=it&field_names=description,brand,nutrition",get8('082347727444'));
    t.equal(2,2);
    t.end();
});