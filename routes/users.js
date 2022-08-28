var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');

var authenticate = require('../authenticate');

/* GET users listing. */
router.route('/')
.get(authenticate.verifyOrdinaryUser ,authenticate.verifyAdmin,function(req, res, next) {
  User.find({}, function (err, user) {
    if (err){
      throw err;
    }
    res.json(user);
});
});

router.post('/signup',(req,res,next)=>{
  User.register(new User({username: req.body.username}),
  req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {  
      if(req.body.firstname)
        user.firstname=req.body.firstname;
      if(req.body.lastname)
        user.lastname=req.body.lastname;
      if(req.body.admin)
        user.admin=req.body.admin;

      user.save((err,user)=>{
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return;
        }
        else{
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true, 
              status: 'Registration Successful!'
            });
          });
        }
      }) 
    }
  });
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{

  var token = authenticate.getToken({_id:req.user._id});

  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json({
    success:true,
    token:token,
    status:'Yopu are successfully logged in'
    });
})

router.get('/logout',(req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err= new Error("You are not Logged IN");
    err.status=403;
    return next(err); 
  }
})

module.exports = router;
