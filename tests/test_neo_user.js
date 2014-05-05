var test = require('tap').test;
var neo = require('neo4j');
var db = new neo.GraphDatabase('http://localhost:7474');
var user = require('./../lib/models/neo4j').user;
    var User = new user(db);/*
test('object ok?',function(t){
    t.notEqual('undefined',typeof(User));
    t.end();
});*/
test('testing findByid',function(t){
    User.methods.findById(67629,function(err,user){
        //t.equal(user.local.email,'arpho@iol.it','fb mail');
        //t.equal(user.Facebook.id,'1022532140','fb id');
        //t.equal(user.Facebook.name,'Giuseppe D\'Amico','fb name');
    t.end();
    })
})
test('testing valid password',function(t){
    t.equal(true,User.methods.validPassword('vilu7240'));
            t.end();
})
test("testing findOne",function(t){
    
    User.methods.findOne('arpho@iol.it',function(err,user){
        t.equal(true,err===null,"no errors");
        t.equal("Giuseppe",user.name,'nome');
        t.end();
    })
})
test("creating new user",function(t){
    User.methods.createUser({name:'test',type:'local',email:'test@mail.it'},function(err,id){
        t.equal(true,err===null,"no errors in createUser");
        console.log(id)
        t.equal('number',typeof(id),'id non nullo');
        t.end();
    })
})
