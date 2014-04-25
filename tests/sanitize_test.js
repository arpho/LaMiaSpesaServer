var sanitize = function(v){
    var out = v;
    console.log('sanitize value: '+v);
    if (typeof(v)=='object' || typeof(v)=='undefined'){out = '';}
    console.log('sanitize out= '+v+';');
    return out;
}
var test = require('tap').test;
    var a;
    test('testing sanitize',function(t){
    t.equal('',sanitize(a),'undefined');
    t.equal('',sanitize({a:'null'}),'null value');
        t.end();
    })