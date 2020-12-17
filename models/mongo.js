var mongoclient = require('mongodb');
const uri = 'mongodb+srv://siva:siva@sample.rplcn.mongodb.net?retryWrites=true&w=majority';
var mongodb;

function connect(){
    mongodb = mongoclient.connect(uri,{useUnifiedTopology:true},(err,conn)=>{
        if(err){
            console.log(err);
        }else{
            mongodb = conn;
            console.log('Connected');
        }
    });
}

function get(){
    return mongodb;
}

function close(){
    mongodb.close();
}

module.exports = {
    connect,
    get,
    close
}
