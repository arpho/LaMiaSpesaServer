'use strict';
/*avoid to put null value in the query
@param object
@return string
if the param is null or undfined return '' otherwise return the value*/
var sanitize = function(v){
    var out = v;
    if (typeof(v)==='object' || typeof(v)=='undefined'){out = '';}
    return out;
   };
module.exports = function(req,res,result,db){
    console.log('new item');
                    var upc_number = req.query.upc,
                    item = result.body,
                        query,params;
                   res.send(result.body); 
                    console.info(item);
                    if(item.return_code!='999'&& item.return_code!='995')
                    { console.log('item  found  in digit8');
                    if (item.image!==null){
                        console.log("scarico l'immagine");
                        var imageUrl = item.image,
                            imageName = require("crypto")
                              .createHash("md5")
                              .update(imageUrl)
                              .digest("hex")+'.'+ imageUrl.slice(-3);  // aggiungo l'estensione del file
                        console.info('immagine: '+imageName);
                            var http = require('http'),
                            fs = require('fs'),
                            dest ="media/pics/"+imageName,
                            download = function(url,dest){
                                console.info('downloading');
                                var file = fs.createWriteStream(dest),
                                request = http.get(url,function(response){
                                    response.pipe(file);
                                    file.on('finish',function(){
                                        file.close();
                                        console.log('image saved');
                                        item.pictures = imageName;
                                        item.return_code = '0'; 
                                        item.source = 3; // 1: our db, 2: digit-8, 3: digit-8 with pics
                                        console.info('item sent at 42');
                                        console.info(item);
                                        res.json(item);
                                console.log('item found in our digit-8 with  picture');
                                console.log('***********************************************************************************************');
                                    });
                                    file.on('error',function(err){console.error(err);});
                                });
                                }; //eof download
                            download(imageUrl,dest); // scarico l'immagine
                        query = [ // creo il nodo dell'item il nodo dell'immagine e la loro relazione
                            'CREATE (i:lms_item{description:{description},',
                            'number:{upc},upc_number:{upc},ratingsup:0,ratingsdown:0,itemname:{itemname},brand:{brand},nutrition:{nutrition}}),',
                            '(p:lms_picture{name:{imageUrl}}),',
                            '(p)-[r:lms_visualizes]->(i)',
                            'RETURN i'
                        ].join('\n');
                    }
                        else{ // there is no image
                            console.log(" no image");
                            query = [
                                'CREATE (i:lms_item{description:{description},',
                                'number:{upc},ratingsup:0,ratingsdown:0,itemname:{itemname},brand:{brand},nutrition:{nutrition}})',
                                'RETURN i'                                
                            ].join('\n');// creo solo il nodo dell'item
                            
                        }
                        params = {upc:upc_number,description:sanitize(item.description),itemname:sanitize(item.description),brand:sanitize(item.brand),imageUrl:sanitize(imageName),nutrition:sanitize(item.nutrition)};
                        db.query(query,params,function(err,dbItem){ //eseguo la query sia che ci sia l'immagine, sia che non ci sia  e ritorno l'oggetto ritornato dalla query
                                 if (err)
                                    {
                                        throw err;
                                    }
                                    else
                                    {
                                        console.log('item created');
                                        console.log(dbItem);
                                        dbItem.return_code = '0';
                                        dbItem.source = 2;
                                        res.json(dbItem);
                                console.log('item found digit-8 db with no picture');
                                console.log('***********************************************************************************************');
                                    }
                                 });
                    } // eof  no item in  digit-eyes
                    else
                    {   console.log('item not found');
                        var out = {itemname:'not found',description:'new Item',return_code:'999'};
                        res.json(out);
                        console.log('item sent back');
                        console.log(out);
                        console.log('item not found');
                        console.log('***********************************************************************************************');
                    }
                        };// eof function
                                                                                       