'use strict;'
/*implementa il concetto di token
@param obj:oggetto che rappresenta l'utente loggato puo' essere l'oggetto user ritornato dal db per il local-login o il profilo ritornato da facebook
@param type: string <'local','facebook'>*/
module.exports.token = function(user,type){
    var self = this,
    uuid = require('node-uuid');
    this.type = type;
    this.user = user;
    this.valid = true;
    this.token = uuid.v4();
    this.timeout = new Date().setTime(new Date().getTime() +2*60*60*1000); // setto un timeout di due ore
    this.getType = function(){return self.type;}
    this.isValid = function(){
    if (new Date().getTime()< self.timeout) return true;
    else return false;
    };
    this.get_user = function() {
        return self.user;
    };
    this.get_timeout = function() {
        return self.timeout;
    }
    this.get_token = function(){
        return self.token;
    }
}