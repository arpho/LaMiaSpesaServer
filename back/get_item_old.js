exports.route = function(req,res,db){
		var upc_number = req.query.upc;
		//console.log(upc_number);
		var query = "MATCH (i:lms_item{number:'"+upc_number+"'}) RETURN i";
        //var Item = {itemname:'item non presente',description:'item non ancora presente nel nostro database'};
        
        var query = [
        'MATCH (i:lms_item)',
        'WHERE i.number  = {upc}',
        'RETURN i'
    ].join('\n');
        var params = {upc:upc_number};
		db.query(query,params,function(err,item){
			if(err){throw err;}
			else{
                if (item.length>0){
	                var Item = item[0].i._data.data;
                    console.log('found item');
                    console.log(item); //looking for pictures
                    var query = "MATCH (i:lms_item{number:'"+upc_number+"'})-[lms_visualizes]-(p:lms_picture) RETURN p";
                    query = [
                                'MATCH (i:lms_item)',
                                '-[lms_visualizes]',
                                '-(p:lms_picture)',
                                'WHERE i.number  = {upc}',
                                'RETURN p'
                    ].join('\n');

                    db.query(query,params,function(err,pics){
                        if(err){throw err;}
                        else{
							if(pics.length>0){
	                            //console.log(pics.data[0].data.name);
	                            //res.send(pics);
	                            console.log('pics');
	                            //console.log(pics);
	                            //console.log(pics[0]);
	                            //console.log(pics[0].p);
	                            console.log(pics[0].p._data.data);
	                            //Item.pictures = pics.data[0].data.name;
	                            /*if (pics.data.length>0){
	                                item.data[0].data.pictures = pics.data[0].data.name;
	                            }*/
	                            //Item = item.data[0].data;
	                              console.log('########################################################################################################################################');
	                              console.log('looked for pictures for  '+upc_number);
	                              console.log('found: '+pics[0].p._data.data.name);
	                              Item.pictures = pics[0].p._data.data.name;
	                              console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
								console.log('item returned');
								console.log(Item);
								res.json(Item);
							}
							else{ // no pictures for the item
								console.log('no pictures');
								res.json(Item);
								 }
                        }
                    });
                }
            
                else{
                        console.log('not item found');
                        console.log('asking to digit-eyes');
                        var buildUrl = require('./../server/digit_eyes_request').get_digit8_request;
                        var url = buildUrl(upc_number);
                        console.log('url');
                        console.log(url);
                        var Item = {}; //require('./../server/digit_eyes_request').testing(); // request retorna unjson grosso il vero item è nel body della risposta
                        require('./../server/digit_eyes_request').doRequest(url,function(result){
                                console.log('response of digit8');
                                console.log(result);
                            
                        var imageUrl = Item.image;
                            console.log(imageUrl);
                        //get the image's url
                        var imageName = require("crypto")
                          .createHash("md5")
                          .update(imageUrl)
                          .digest("hex")+'.'+ imageUrl.slice(-3);
                            
                        }); // get the last three characters, the extension
                        //console.log(imageName);
                        // procedo per scaricare l'immagine 
                        var http = require('http'),
                        fs = require('fs'),
                        //dest ="media/pics/"+imageName;
                            /*
                        download = function(url,dest){
                            var file = fs.createWriteStream(dest),
                            request = http.get(url,function(response){
                                response.pipe(file);
                                file.on('finish',function(){
                                    file.close();
                                    console.log('image saved');
                                });
                            });
                        };
                        download(imageUrl,dest); // scarico l'immagine e la salvo in dest*/
                        /*var dbItem = {};
                        dbItem.ratingsup = 0;
                        dbItem.ratingsdown = 0;
                        dbItem.description = Item.description;
                        dbItem.itemname = Item.description;
                        dbItem.number = upc_number;
                        dbItem.itemname = Item.brand;*/

                        var node = db.createNode({ratingsdown:0,ratingsup:0,description:Item.description,number:upc_number,itemname:Item.description});
                        node.save(function (err, node) {    // ...this is what actually persists.
    if (err) {
        console.error('Error saving new node to database:', err);
    } else {
        dbItem.id = node.id;
        console.log('Node saved to database with id:', node.id);
        //add label lms_item to the new node
        var query = [
        'START n = NODE({id})',
        'SET n:lms_item'
    ].join('\n');
        var params = {id:dbItem.id};
        db.query(query,params,function(err){
            if(err){throw err;}
            else {
                //creo il nodo lms_picture e la relazione (lms_picture)-[lms_visualizes]->(lms_item)
                var query = [
                    'START i= NODE({itemId},CREATE',
                    '(p:lms_picture{name:{imageName}})',
                    '(p)-[r:lms_visualizes]->(i)'
                ],
                    params = {itemId:dbItem.id,imageName:imageName};
                
                db.query(query,params,function(err){
                    if (err) {throw err;}
                    else {
                        console.log('item saved on db');
                        dbItem.pictures = imageName;
                        res.json(dbItem);
                    }
                });
            }
            
                                           });
        
    }
});
                    }
            }
            
		});
	};
*/