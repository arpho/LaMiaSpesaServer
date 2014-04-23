'use strict';
module.exports = function(req,res,result,db){
                    var item = result.body,
                        query,params;
                   res.send(result.body); 
                    console.log(item);
                    console.log(item.image);
                    if (item.image!=null){
                        console.log("scarico l'immagine");
                        var imageUrl = item.image;
                            var imageName = require("crypto")
                              .createHash("md5")
                              .update(imageUrl)
                              .digest("hex")+'.'+ imageUrl.slice(-3);  // aggiungo l'estensione del file
                            var http = require('http'),
                            fs = require('fs'),
                            dest ="media/pics/"+imageName,
                            download = function(url,dest){
                                var file = fs.createWriteStream(dest),
                                request = http.get(url,function(response){
                                    response.pipe(file);
                                    file.on('finish',function(){
                                        file.close();
                                        console.log('image saved');
                                    });
                                })
                                }; //eof download
                            download(imageUrl,dest); // scarico l'immagine
                        query = [ // creo il nodo dell'item il nodo dell'immagine e la loro relazione
                            'CREATE (i:lms_item{description:{description},',
                            'ratingsup:0,ratingsdown:0,itemname:{itemname},drand:{brand}}),',
                            '(p:lms_picture{name:{imageUrl}}),',
                            '(p)-[r:lms_visualizes]->(i)',
                            'RETURN i'
                        ].join('\n');
                    }
                        else{ // there is no image
                            console.log(" no image");
                            query = [
                                'CREATE (i:lms_item{description:{description},',
                                'ratingsup:0,ratingsdown:0,itemname:{itemname},drand:{brand}})',
                                'RETURN i'                                
                            ].join('\n');// creo solo il nodo dell'item
                            
                        }
                        params = {description:item.description,itemname:item.description,brand:item.brand,imageUrl:imageName};
                        console.log(query);
                        console.log(params);
                        db.query(query,params,function(err,dbItem){ //eseguo la query sia che ci sia l'immagine, sia che non ci sia  e ritorno l'oggetto ritornato dalla query
                                 if (err)
                                    {
                                        throw err;
                                    }
                                    else
                                    {
                                        res.json(dbItem);
                                    }
                                 }); // eseguo la query
                        
                        };// eof function
                                                                                       