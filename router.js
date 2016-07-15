var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session')
var bodyParser = require('body-parser')

var db=require('./db');
var User=require('./models/user');
var Massage=require('./models/massage');

var port=8888;
var config=require('./config');
config.passport(passport);
mongoose.connect(config.database);


app.set('views', './views')
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({
  secret: 'fuckyou',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

function showErr(req,res,err) {
  res.render('fail.ejs',{'err':err});
}


//db.addTest();
function isLogin(req,res,next) {
  if(req.isAuthenticated()) {
    res.redirect('/profile');
  }
  return next();
}
app.get('/',isLogin,function(req,res) {
  res.render('index.ejs');
});


function isAuthen(req,res,next) {
  if(req.isAuthenticated()) return next();
  console.log('not authen');
  res.redirect('/');
}
app.get('/profile',isAuthen,function(req,res) {
  db.getMassageByOwner(req.user.id,function(err,msgs) {
    if(err) showErr(req,res,err);
    res.render('profile.ejs',{
      user:req.user,
      'msgs':msgs
    });
  });
});


app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
app.get('/auth/facebook/callback',passport.authenticate('facebook', {
    successRedirect : '/profile',
		failureRedirect : '/'
	})
);


app.get('/fail', function(req, res) {
		res.send('fail page');
});


app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
});


app.post('/edit',isAuthen,function(req,res) {
  console.log('edit');
  db.setMassage(req.body.tag,
    req.body.ntag,
    req.body.ntext,
    req.user.id,
    function(err) {
      if(err) showErr(req,res,err);
      else res.redirect('/'+req.body.ntag);
  });
});

app.post('/add',isAuthen,function(req,res) {
  console.log('send',req.body.text);
  console.log('user',req.user.id);
  db.addMassage(req.body.text,req.user.id,function(err) {
    if(err) showErr(req,res,err);
    else res.redirect('/profile');
  });
});

app.get('/*',function(req,res) {
  console.log(req.path);
  db.getMassageByTag(req.path.slice(1),function(err,msg) {
    if(err) showErr(req,res,err);
    if(msg) {
      pwn=false;
      if(req.user&&req.user.id==msg.owner) pwn=true;
      res.render('massage.ejs',{
        user:req.user,
        'msg':msg,
        'pwn':pwn
      });
    } else showErr(req,res,'Massage not found!!');
  });
});


app.listen(port);
