'use strict';
/*è un singletone, unico per tutti i moduli che lo invocano con lo stesso path  e va semplicemente required
i tokens sono memorizzati in un dizionario con chiave il valore del token ogni 24 ore vengono rimossi i token scaduti*/
var tokens = {}; 
module.exports.addToken = function(t) {
    console.log('adding token '+t.get_token());
tokens[t.get_token()] = t;
    console.log("TOKEN added ="+(undefined!=typeof(tokens[t.get_token()])))

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
    console.log("verifico validità di: "+t)
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

var removeToken = function(key){
    var tok = tokens[key];
    if(typeof(tok)!="undefined") delete tokens[key];
    
}
var rinnovaToken = function(tok){
    console.log("rinnovo il token "+tok)
    var oldToken = tokens[tok];
    if("undefined"==typeof(oldToken)) throw "token non presente"
    var token = require('./token').token
    var newToken = new token(oldToken.get_user(),oldToken.getType())
    this.addToken(newToken);
    return  newToken;
}
module.exports.rinnovaToken = rinnovaToken;
module.exports.removeToken = removeToken;
//pulisco loa lista di token ogni 24 ore 
(clean,24*60*60*1000); 
module.exports.clean = clean;