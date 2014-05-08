
var neo = require('neo4j'),id =67629;
var db = new neo.GraphDatabase('http://localhost:7474');
var query =["start n = node({id})",
               " match (n)-[r:lms_logs_with]-(o) return n,r,o"].join('\n'),
    params = {id:id};

db.query(query,params,function(err,user){
    console.log(user);
    console.log(user.length);
    console.log(user[0].o.data);
})