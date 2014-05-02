var test = require('tap').test;
var neo = require('neo4j');
var db = new neo.GraphDatabase('http://localhost:7474');
var user = require('./../lib/models/neo4j/user').user;
    var User = new user(db);/*
test('object ok?',function(t){
    t.notEqual('undefined',typeof(User));
    t.end();
});*/
test('testing findByid',function(t){
    User.methods.findById(67629,function(err,user){
        console.log(user);
        t.equal(user.local.email,'arpho@iol.it','fb mail');
        t.equal(user.Facebook.id,'1022532140','fb id');
        t.equal(user.Facebook.name,'Giuseppe D\'Amico','fb name');
    t.end();
    })
})
test('testing valid password',function(t){
    t.equal(true,User.methods.validPassword('vilu7240'));
            t.end();
})

