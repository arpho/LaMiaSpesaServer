"use strict";

var tList = require("../app/scripts/utility/token_list"),
token = require('../app/scripts/utility/token').token,
assert = require('assert'),
test = require('tap').test,
    countProperty = function(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

test('it works',function(t){
    t.notEqual('undefined',tList,'tList');
    t.end();
});
var Token;
test('adding token',function(t){
    Token = new token({user:'user'},'test');
    Token.timeout = new Date().setTime(new Date().getTime() -60*60*1000); // rendo il token expired
    tList.addToken(Token);
    t.equal(1,countProperty(tList.getAllToken()),'token added');
    t.equal(false,tList.isValid(Token.get_token()),'token expired');
    //t.equal(0,countProperty(tList.getAllToken()),'cancellato expired token');
    t.end();
    
    
});
test('cleaninglist',function(t){
    t.equal(1,countProperty(tList.getAllToken()),'token added from previous test');
    tList.clean(); // rimuovo il token scaduto
    t.equal(0,countProperty(tList.getAllToken()),'tList pulita');
    t.end();
    
});
test('findByToken',function(t){
    Token = new token({user:'user'},'test');
    tList.addToken(Token);
    tList.findByToken(Token.get_token(),function(err,user){
        t.equal(true,'undefined'!=typeof(user),'false token');
        t.equal(true,'user'==user.user,'found token');
        console.log('user');
        console.log(user);
        t.end();
    })
    
})