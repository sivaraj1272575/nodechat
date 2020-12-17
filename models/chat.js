var mongo = require('./mongo');
var id;
var myid;
var frnd;

module.exports = function(io){
    io.on('connection',(socket)=>{
        console.log('User Connected');

        socket.on('control',(data)=>{
            id = data.socket;
            console.log(data.user,data.socket);
            console.log(typeof(data.socket));
            var dbo = mongo.get().db('users').collection('user');
            myid = data.user;
            dbo.updateOne({_id: data.user},{$set:{socket: id}},(err,det)=>{
                if(err) throw err;
                else{
                    console.log("db updated");
                }
            });
        });

        socket.on('getdata',(dt)=>{
            var dbo = mongo.get().db('friends').collection('friend');
            frnd = dt.to;
            console.log(dt.from,dt.to);
            dbo.findOne({users:{$all: [dt.from,dt.to]}},(err,data)=>{
                if(err) throw err;
                else{
                    io.to(id).emit('old_message',{messages:data.messages});
                }
            });
        });

        socket.on('new_message',(data)=>{
            var dbo = mongo.get().db('friends').collection('friend');
            dbo.updateOne({users:{$all:[frnd,myid]}},{$push :{messages: data}},(err,data1)=>{
                if(err) throw err;
                else{
                    dbo.findOne({_id: myid},(err,data1)=>{
                        if(data.socket){
                            io.to(data.socket).emit('message',data);
                        }
                    });
                }
            });
        });

        socket.on('disconnect',()=>{
            console.log('Disconnected');
            var dbo = mongo.get().db('users').collection('user');
            dbo.updateOne({socket: id},{$unset:{socket:""}},(err,det)=>{
                if(err) throw err;
                else{
                    console.log("db updated");
                }
            });
        });
    });
}
