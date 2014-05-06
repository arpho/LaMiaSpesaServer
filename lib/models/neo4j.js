'use strict;'
var bcrypt   = require('bcrypt-nodejs');
var uuid = require('node-uuid');
module.exports.user = function user(db){
    var self = this;
    this.db = db;
    this.local = {};
    this.local.password = null;
    this.Facebook = {};
    this.methods = {};
    this.id = null;
    this.user = {};
    this.user.local = {};
    this.methods.findOne = function(par){
        /*
        cerca l'utente  che possiede un nodo lms_auth di tipo, campo  e valore corrispondenti ai parametri
        @param: {type:<'Facebook','Google','local'>,field:<'email','id'>}
        @return: lms_user id
        */
    };
    this.methods.hashify = function(p){
        return bcrypt.hashSync(p);
    };
    this.methods.findById = function(id,next){
    var query =["start n = node({id})",
               "  return n"].join('\n'),
    params = {id:id};
    db.query(query,params,function(err,user){
        if (err) {next(err);
                 throw err;}
        else{
            this.id = id;
            this.local = user[0].n; // in generale il risultato è una lista, avrò un user per ogni modalità di accesso registrata
            next(err,self.user);
            
        }
    });
};  this.methods.createUser = function(user,next){
    var query = "create (n:lms_user {user}) return id(n) as id",
        params = {user:user};
    db.query(query,params,function(err,user_id){
        next(err,user_id[0].id);
    });
};
    this.methods.findOne = function(email,next){
        var query =  "match (n:lms_user {email:'"+email+"'}) return n,id(n) as id",
            params = {mail:email};
        console.log("looking for: ")
        console.log(email);
        db.query(query,params,function(err,user){
            if (err){
                    next(err);
                console.log('errore');
                console.log(err);
                throw err;
                    }
            else{
                var out;
                if (user.length<1){
                    out = null;
                }
                else {
                    out = user[0].n.data;
                    out.id = user[0].id;
                    self.user = out;
                }
                next(err,out);
            }
        });
    };
    this.methods.set_token = function(next){
        var query = ["start n= node({id}) ",
                    " set n.api_token = {token}, n.expire = {timeout}"].join('\n'),
            now = new Date(),
            token = uuid.v1();
            params = {id: self.user.id,token: token,timeout: new Date().setTime(now.getTime()+ 2*60*60) }// generiamo un token basato sull'ora e setto un timeout di due ore
            db.query(query,params,function(err){
                if (err) throw err;
                next(token);
            })
    }
    this.methods.get_id = function(){
        return self.user.id;
    }
    this.methods.findFb = function(id,next){
        var query =  "match (n:lms_user {fb_id:'"+id+"'}) return n,id(n) as id",
            params = {mail:id};
        db.query(query,params,function(err,user){
            if (err){
                    next(err);
                throw err;
                    }
            else{
                console.log('no errors found');
                console.log(user)
                var out;
                if (user.length<1){
                    out = null;
                    console.log("no fb found");
                }
                else {
                    console.log('found fb profile');
                    out = user[0].n.data;
                    out.id = user[0].id;
                    self.user = out;
                }console.log('sending back');
                console.log(out);
                next(err,out);
            }
        });
    };
    this.methods.validPassword = function(password) {
        console.log('password received validpassword: '+password)
        if (self.user.password && self.user.enabled)    return bcrypt.compareSync(password, self.user.password);
        return false;
};
     // generating a hash
    this.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        // checking if password is valid
    
   
    
   
        
};

    
    

};