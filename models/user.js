var mongo = require('./mongo');
var url = require('url');
const session = require('express-session');
const { ObjectId } = require('mongodb');

function home(req,res){
    if(req.session.user){
        var dbo = mongo.get().db('friends').collection('friend');
        dbo.find({users: req.session.user.email,status: 'FRIEND'},{users: 1}).toArray((err,data)=>{
            if(err) throw err;
            else{
                console.log(data);
                var friends = [];
                for(i=0;i<data.length;i++){
                    if(data[i].users[0]==req.session.user.email)
                        friends.push(data[i].users[1]);
                    else
                        friends.push(data[i].users[0]);
                }
                var dbo1 = mongo.get().db('users').collection('user').find({_id:{$in: friends}},{"password": 0}).toArray((err,data1)=>{
                    if(err) throw err;
                    else{
                        res.render('home',{user: req.session.user, friends: data1});
                    }
                });
            }

        });
        
    }else{
        res.render('layout');
    }
}

function show_friends(req,res){
    var dbo = mongo.get().db('users').collection('user');
    dbo.find({"_id":{$ne: req.session.user.email}}).toArray((err,data)=>{
        if(err) throw err;
        else{
            res.render('show_friends',{user:req.session.user, frnds: data});
        }
    });
}

function view_friend(req,res){
    var dbo = mongo.get().db('users').collection('user');
    var qry = url.parse(req.url,true).query;
    console.log(qry.user);
    dbo.findOne({"_id":qry.user},(err,data1)=>{
        if(err) throw err;
        else{
            var status = 'send';
            var dbo1 = mongo.get().db('friends').collection('friend');
            dbo1.findOne({users:{$all: [req.session.user.email, qry.user]}},(err,data2)=>{
                console.log(data1,data2);
                if(data2){
                    if(data2.status=='FRIEND')
                        status='friend';
                    else if(data2.status=='WAITING' && data2.sender==req.session.user.email)
                        status='sent';
                    else
                        status='requested'
                    res.render('view_friend',{user:req.session.user, friend: data1, status: status, id: data2._id});
                }
                else{
                    res.render('view_friend',{user:req.session.user, friend: data1});
                }
                
                
            });
        }
        
    });
}

function sent_request(req,res){
    var qry = url.parse(req.url,true).query;
    var dbo = mongo.get().db('friends').collection('friend');
    dbo.insertOne({users:[req.session.user.email,qry.user],sender:req.session.user.email,status:'WAITING',messages :[]},(err,det)=>{
        if(err) throw err;
        else{
            req.flash('success','Friend Request Sent');
            res.redirect('/user/friends');
        }
    });
}

function accept_request(req,res){
    var qry = url.parse(req.url,true).query;
    console.log(ObjectId(qry.user));
    var dbo = mongo.get().db('friends').collection('friend');
    dbo.updateOne({"_id":ObjectId(qry.user)},{$set: {status: 'FRIEND'}},(err,det)=>{
        if(err) throw err;
        else{
            req.flash('success','Request Accepted');
            res.redirect('/user/friends');
        }
    })
}

module.exports={
    home,
    show_friends,
    view_friend,
    sent_request,
    accept_request
};

