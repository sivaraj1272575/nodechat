const session = require('express-session');
var mongo = require('./mongo');

var email;

function verify(req,res){
    var email = req.body.email;
    var pass = req.body.pass;
    var dbo = mongo.get().db('users').collection('user');
    dbo.findOne({_id: email},(err,data)=>{
        if(err){
            console.log(err);
            console.log('Error in Login Try Again Later');
        }else{
            if(data){
                if(data.password==pass){
                    user={
                        email: data._id,
                        name: data.name,
                        profile: data.profile,
                    }
                    req.session.user = user;
                    req.session.cookie = {maxAge: 172800000};
                    res.redirect('/home');
                }
                else{
                    console.log('Incorrect Password');
                    res.redirect('/login');
                }

            }else{
                console.log('Account Not Found');
                res.redirect('/login');
            }
        }
    });
}

function forget(req,res){
    if(req.session.user){

    }else{
        res.render('forget_password1');
    }
}

function logout(req,res){
    req.session.destroy();
    res.redirect('/login');
}

module.exports={
    verify,
    forget,
    logout
};