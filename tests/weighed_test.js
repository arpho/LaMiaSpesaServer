'use strict';
var priceExtractor = function(upc){
    var s = upc.substr(0,upc.length-1);
    console.log('s:'+s);
    var price = 0;
    for (var i=0,esp=2;i<s.length;i++,esp--){
        //console.log("char: "+s.charAt(i)+ " power:"+ Math.pow(10,esp));
        price += parseInt(s.charAt(i))*Math.pow(10,esp);
        //console.log('price: '+price);
    }
    return parseFloat(price.toFixed(2));
 //var  price = parseInt(s)/10;
    
    return price;
}
var test = require('tap').test;
var request = require('superagent');
test('broccoletti esse ',function(t){
    var url = "http://localhost:8080/get_weighed?upc=2047960000822";
    request.get(url).end(function(err,res){
        console.log('res.body');
        console.log(res.body);
        t.equal(res.body.error,0,"no errori");
        t.equal(res.body.upc,"2047960000822","upc");
        t.equal(res.body.store,'04','store');
        t.equal(res.body.price,0.82,'price');
        t.end();
    })
});
test('cipollotti bianchi esse ',function(t){
    var url = "http://localhost:8080/get_weighed?upc=2047460000391";
    request.get(url).end(function(err,res){
        console.log('res.body');
        console.log(res.body);
        t.equal(res.body.error,0,"no errori");
        //t.equal(res.body.upc,"2047960000822","upc");
        t.equal(res.body.store,'04','store');
        t.equal(res.body.price,0.39,'price');
        t.end();
    })
});
test('banane esse ',function(t){
    var url = "http://localhost:8080/get_weighed?upc=2044760002858";
    request.get(url).end(function(err,res){
        console.log('res.body');
        console.log(res.body);
        t.equal(res.body.error,0,"no errori");
        //t.equal(res.body.upc,"2047960000822","upc");
        t.equal(res.body.store,'04','store');
        t.equal(res.body.price,2.85,'price');
        t.end();
    })
});
test('noci cocco esse ',function(t){
    var url = "http://localhost:8080/get_weighed?upc=2045090001030";
    request.get(url).end(function(err,res){
        console.log('res.body');
        console.log(res.body);
        t.equal(res.body.error,0,"no errori");
        //t.equal(res.body.upc,"2047960000822","upc");
        t.equal(res.body.store,'04','store');
        t.equal(res.body.price,1.03,'price');
        t.end();
    })
});
test('ananas ',function(t){
    var url = "http://localhost:8080/get_weighed?upc=2130057002820";
    request.get(url).end(function(err,res){
        console.log('res.body');
        console.log(res.body);
        t.equal(res.body.error,0,"no errori");
        //t.equal(res.body.upc,"2047960000822","upc");
        t.equal(res.body.store,'13','store');
        t.equal(res.body.price,2.82,'price');
        t.end();
    })
});

test("testing priceExtractor",function(t){
    t.equal(priceExtractor('000822'),0.82,'full price');
    t.equal(priceExtractor('00100'),1,'unità');
    t.equal(priceExtractor('01000'),10,'decine');
    t.equal(priceExtractor('10000'),100,'centinaia');
    t.end();
})
