
exports.route2 = function(req,res,db){
        console.log('***********************************************************************************************');
        console.log(new Date());
        console.log('mew request');
		var upc_number = req.query.upc;
        console.log('looking for: '+upc_number);
        var query = [
        'MATCH (i:lms_item)',
        'WHERE i.number  = {upc}',
        'RETURN i'
    ].join('\n');
        var params = {upc:upc_number};
    //cerchiamo lo item nel db
    db.query(query,params,function(err,item){
        if (err){
            console.log('errore');
            throw err;}
        else{
            console.info('callback query db item');
            console.info(item);
            if (item.length>0){
                var Item = item[0].i._data.data;
                console.log('item in db');
                console.log(Item);
            var query = "MATCH (i:lms_item{number:'"+upc_number+"'})-[lms_visualizes]-(p:lms_picture) RETURN p";
            query = [
                                'MATCH (i:lms_item)',
                                '-[lms_visualizes]',
                                '-(p:lms_picture)',
                                'WHERE i.number  = {upc}',
                                'RETURN p'
            ].join('\n');
                console.info('query db for picture');
                console.info(query);
            db.query(query,params,function(err,pics){
                        if(err){throw err;}
                        else{
							if(pics.length>0){
	                            //console.log(pics.data[0].data.name);
	                            //res.send(pics);
	                            console.log('pics[0].p._data.data.name');
	                            //console.log(pics);
	                            //console.log(pics[0]);
	                            //console.log(pics[0].p);
	                            console.log(pics[0].p._data.data.name);
	                            //Item.pictures = pics.data[0].data.name;
	                            //Item = item.data[0].data;
	                              Item.pictures = pics[0].p._data.data.name;
                                  Item.source = 1; //sorgente 1 our db, 2 digit-eyes
								console.log('item returned');
                                Item.return_code ='0';
								console.log(Item);
								res.json(Item);
                                console.log('item found in our db with picture');
                                console.log('***********************************************************************************************');
                                
							}
							else{ // no pictures for the item
								console.log('no pictures');
                                console.log('item sent:');
                                Item.return_code = '0'; // 
                                console.log(Item);
								res.json(Item);
                                console.log('item found in our db with no picture');
                                console.log('***********************************************************************************************');
								 }
                        }
                    });
            }//eof if item.length>0 controllato che l'item sia sul nostro db
            else{ // se l'item non è nel nodtro db
                //res.json({message:'new item'});
                        var buildUrl = require('./../server/digit_eyes_request').get_digit8_request;
                        var url = buildUrl(upc_number);
                        console.log('url');
                        console.log(url);
                console.log({message:'asking to digi8'});
                require('./../server/digit_eyes_request').doRequest(url,function(result){
                    require('./../server/insertItem')(req,res,result,db);
                });
                
            }
        }
    });
    
}