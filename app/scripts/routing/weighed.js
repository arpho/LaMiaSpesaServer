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
exports.route = function(req,res,db){
    var upc = req.query.upc,
        toInsert = req.query.toInsert,
    store = upc.substr(1,2),
        price = upc.substr(7);
    if (toInsert){
        var query = [
            "create (i:lms_item:lms_weighed ",
            "{price:{price},",
            "store:{store},",
            "date:{date}}) ",
            "return i,id(i) as id"].join('\n'),
        params = {price:priceExtractor(price),store:store,date:new Date()};
    console.log("inserting new weighed item");
    db.query(query,params,function(err,item){
        if (err) {throw err}
        else{
           var out = item[0].i.data;
            out.id = item[0].id;
            console.log(item[0].i);
            out.error = 0;
            console.log("json sent back:");
            console.log(out);
            res.json(out);
        }
    })
}
    else{
        console.log("item not stored");
        res.json({message:'request processed',error:0,upc:upc,store:store,price:priceExtractor(price)});}
    
};