'use strict;'
var test = require('tap').test;
var token = require('../app/scripts/utility/token').token;
TOKEN = new token(5,'local');
test('token works',function(t){
    t.notEqual('undefined',typeof(token),'instanziato');
    var Token = TOKEN.get_token();
    t.equal(true,typeof(Token=='string') &&(Token.length==36),'token');
    t.equal(true,TOKEN.isValid(),'token valido');
    t.equal('local',TOKEN.getType(),'type');
    var timeout = new Date().setTime(new Date().getTime() +2*60*60*1000); // dovrebbe scadere dopo quello del token
    t.equal(5,TOKEN.get_user(),'user');
    t.equal(true,TOKEN.get_timeout()<timeout,'timeout');
    t.end();
});