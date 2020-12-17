var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var bodyparser = require('body-parser');
var mongo = require('./models/mongo');
var flash = require('connect-flash');
var session = require('express-session');
var io = require('socket.io')(http);


var multer = require('multer');
var stor = multer.diskStorage({});
var parser = multer({storage: stor});

mongo.connect();

//Defaults
app.use(express.static("css"));
app.use(express.static("public"));
app.use(express.static(__dirname+'/'));
app.use(bodyparser.urlencoded({extended: true}));
app.set('views',path.join(__dirname+'/views'));
app.set('view engine','pug');
app.use(flash());
app.use(session({secret: 'shhhh',
saveUninitialiazed: true,
resave: true}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



app.get('/',(req,res)=>{
    //req.session.user = {email:"sivaraj1272575@gmail.com",name:"Sivaraj",profile:"http://res.cloudinary.com/dusysmbzd/image/upload/v1607673230/y2w2nxvx1s99zgg9bzl7.jpg"};
    res.redirect('/home');
});



//Register User
var reg = require('./models/register');
{
    app.get('/register',(req,res)=>{
        res.render('register');
    });
    app.post('/register1',reg.send_mail);
    app.post('/verify',reg.verify_otp);
    app.post('/register2',(parser.single('profile')),reg.register2);

}

//Login User
var login = require('./models/login');
{
    app.get('/login',(req,res)=>{
        res.render('login');
    });
    app.post('/login',login.verify);
    app.get('/logout',login.logout);

}

//User Home
{
    var user = require('./models/user');
    app.get('/home',user.home);
    app.get('/user/friends',user.show_friends);
    app.get('/user/friends/view/',user.view_friend);
    app.get('/user/friends/sentRequest/',user.sent_request);
    app.get('/user/friends/acceptRequest/',user.accept_request);
}

//Chat
{
    var chat = require('./models/chat');
    chat(io);
}


http.listen('8080',()=>{
    console.log('Listen in 8080');
});


