'use strict';
/*è un singletone, unico per tutta l'appicazione e va semplicemente required
i tokens sono memorizzati in un dizionario conchiave il valore del token ogni due ore vengono rimossi i token scaduti*/
var tokens = {}; 
module.exports.addToken = function(t) {
    console.log('adding token');
tokens[t.get_token()] = t;

};
module.exports.findByToken = function(token,next){
    next(null,tokens[token].get_user());
    
}
module.exports.getAllToken = function() {
    return tokens;
};

module.exports.countToken =  function(){
    var countProperty = function(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}
    return countProperty(tokens);
}
module.exports.isValid = function(t){
    var valid = false,
    tok = tokens[t];
    if(typeof(tok)=='undefined') return false;
    else return tok.isValid();
};

var clean = function(){
    for (var key in tokens){
        var tok = tokens[key];
        if(tok){ // if not undefined
            if(!tok.isValid()) delete tokens[key]; // rimuovo il token scaduto
        }
    }
};
//pulisco loa lista di token ogni due ore 
setInterval(clean,2*60*60*1000); 
module.exports.clean = clean;