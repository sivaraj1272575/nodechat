const { text } = require('body-parser');
var mailer = require('nodemailer');
var mongo = require('./mongo');
const uri = 'mongodb+srv://siva:siva@sample.rplcn.mongodb.net?retryWrites=true&w=majority';
var cloud = require('cloudinary').v2;



cloud.config({
    cloud_name: 'dusysmbzd', 
    api_key: '374241559218949', 
    api_secret: 'epYg-7OAsCMI0uKcI_dOLz1qKao' 

});

var otp;
var email;
var transport = mailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'siva.psg1372001@gmail.com',
        pass: 'Siva@9345'
    }
});

function randInt(){
    var temp = Math.ceil(Math.random()*(9999-1000))+1000;
    console.log(temp);
    return temp;
}

function send_mail(req,res){
    var mail = req.body.email;
    otp = randInt();
    console.log(otp);
    var dbo = mongo.get().db('users').collection('user');
    dbo.findOne({_id: mail},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            if(data){
                console.log('username Already Exists');
                console.log(data);
                console.log(err);
                res.render('login');
            }
            else{
                console.log(data);
                email = mail;
                var content = {
                    to: mail,
                    subject: 'OTP for Account Opening Reg',
                    text: 'Thank You for choosing our app. Your One Time Password is '+otp
                };
                transport.sendMail(content,(err,info)=>{
                    if(err){
                        console.log(err);
                    }
                    else{   
                        res.render('otp');
                    }
                });
            }
        }
    });
    
}

function verify_otp(req,res){
    var otp1 = req.body.otp;
    if(parseInt(otp1)===otp){
        res.render('register2');
    }else{
        console.log("Incorrect OTP");
    }
}

function register2(req,res){
    var nm = req.body.name;
    var pass1 = req.body.pass1;
    var pass2 = req.body.pass2;
    console.log(req.file.path);
    if(pass1===pass2){
        if(req.file){
            cloud.uploader.upload(req.file.path,(err,info)=>{
                console.log(err,info);
                var photo = info.url;
                var det={
                    _id :email,
                    name: nm,
                    password: pass1,
                    profile: photo
                };
                var conn = mongo.get().db('users').collection('user');
                conn.insertOne(det,(err,info)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.render('login');
                    }
                });
            }); 
        }
        else{
            var photo = 'https://res.cloudinary.com/dusysmbzd/image/upload/v1593573412/default_pemph5.png';
            var det={
                _id :email,
                name: nm,
                password: pass1,
                profile: photo,
                friends: []
            };
            var conn = mongo.get().db('users').collection('user');
            conn.insertOne(det,(err,info)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render('login');
                }
            });
        }
    }else{
        req.flash('danger','Password and Confirm Password must be same');
        res.render('register2');
    }
}

module.exports={
    send_mail,
    verify_otp,
    register2
}