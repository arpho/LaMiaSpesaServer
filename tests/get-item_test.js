'use strict';
var test = require('tap').test;
var request = require('superagent');
test('get-item should respond with an item in our db',function(t){
    var url = "http://localhost:8080/get_item?upc=7313468675004";
    request.get(url).end(function(err,res){
        //console.log(res.body);
        t.equal('0',res.body.return_code,'richiesta eseguita senza errori');
        t.equal(1,res.body.source,'dal nostro db ');
        t.notEqual('undefined',res.body.id,'item has id');
        t.notEqual('undefined',typeof(res.body.pictures),'è allegata una foto');
        t.end();
    })
})
;
/*
test('get-item should respond with an error',function(t){
    var url = "http://localhost:8080/get_item?upc=1234567898531";
    request.get(url).end(function(err,res){
        console.log('response');
        console.log(res.body);
        t.equal('999',res.body.return_code," item not in our db nor in dit-8's db");
        t.notEqual('undefined',res.body.id,'item has id');
       // t.equal(1,res.body.source);
        //t.notEqual('undefined',typeof(res.body.pictures));
        t.end();
    })
});*/

test("get-item with object not in our db, but in digit-8's one",function(t){
    var url = "http://localhost:8080/get_item?upc=8010312088117"; // dvd avatar
    var request = require('superagent');
    request.get(url).end(function(err,res){
        console.info('res');
        //console.log(err);
        console.log(res.body);
        t.equal('0',res.body.return_code," non ci sono messaggi di errore");
        t.notEqual('undefined',res.body.id,'item has id');
        //t.equal(3,res.body.source,"item in digit-8's db");
        //t.notEqual('undefined',typeof(res.body.pictures),'è allegata una foto');
        //devo verificare che l'item sia stato aggiunto nel nostro db
        request.get(url).end(function(err,res){
        t.equal(1,res.body.source,'dal nostro db ');
        //t.notEqual('undefined',typeof(res.body.pictures),'è allegata una foto')
            
        })
       // t.equal(1,res.body.source);
        //t.notEqual('undefined',typeof(res.body.pictures));
        t.end();
    })
});
