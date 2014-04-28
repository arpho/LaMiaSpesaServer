'use strict';

var priceExtractor = function(upc){/*
estrae il prezzo dalla stringa upc
@param: string
@note:l'ultimo carattere del codice upc è il carattere di controllo*/
    var s = upc.substr(0,upc.length-1); // elimino il carattere di controllo
    var price = 0;
    //parso il valore del prezzo la prima cifra indica le centinaia, poi le decine e così via fino ai centesimi
    for (var i=0,esp=2;i<s.length;i++,esp--){
        price += parseInt(s.charAt(i))*Math.pow(10,esp);
    }
    return parseFloat(price.toFixed(2));
    
    return price;
}
exports.route = function(req,res){
    var upc = req.query.upc;
    var store = upc.substr(1,2),
        price = upc.substr(7);
    res.json({message:'request processed',error:0,upc:upc,store:store,price:priceExtractor(price)});
};