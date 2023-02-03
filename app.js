const express = require("express");
const codes= require('referral-codes')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const QRCode = require('qrcode')
const port = 5000 || process.env.PORT;
const path = require('path');
const {User}=require("./schema");
const {Referral}=require("./schema");
const { deepStrictEqual } = require("assert");
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({
  extended: false
}));
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.get("/", function (req, res) {
  res.render("index");
});
app.get("/login",function(req,res)
{
    res.render("login");
});
// app.post("/details",function(req,res){
//     console.log("here");
//       const refer1=codes.generate({
//         length: 6,
//         count: 1,
//       });      
//       const id=req.body.userid;
//       var user1 = new Referral({ userid:id,refer:refer1[0]});
//       user1.save(function (err, results) {
//              if(err==null)
//              {
//                 console.log("data successfully inserted");
//              }
//       });
//       res.sendFile(path.join(__dirname,'final.html'));

// });
app.post("/register",function(req,res){
      
  const findInDB= User.findOne({userid:req.body.user},function (err, docs) {
          
           if(err==null)
           {
            res.render("index",{"message":"Already Registered"});
           }
           else{

            var user1 = new User({ name: req.body.name, email:req.body.email,userid:req.body.user,password:req.body.password});
            user1.save(function (err, results) {
                   if(err==null)
                   {
                      console.log("data successfully inserted");
                   }
            });
            const refer1=codes.generate({
              length: 6,
              count: 1,
            }); 
            var user2 = new Referral({ userid:req.body.user,refer:refer1[0]});
            user2.save(function (err, results) {
                   if(err==null)
                   {
                      console.log("data successfully inserted");
                   }
            });
      
            res.render("index",{message:"Successfully Registered"});

           }

           console.log(err);
           console.log(docs)

  });

     

  
});
app.post("/signin",function(req,res){
  console.log(req.body.user);


  if(req.body.login=="login1")
  {
    if((req.body.user=="testuser" && req.body.password=="test@123")||(req.body.user=="dummyuser" && req.body.password=="test@321"))
    {
      res.render("owner");
    }
    else{
      res.render("login",{
        error: 'Invalid Credential!'
        });
    }
  }else{


    const findInDB= User.findOne({userid:req.body.user},function (err, docs) {
          console.log(docs);
          if( docs.password==req.body.password)
          {
            const findInDB= Referral.findOne({userid:req.body.user},function (err, docs1) {
              const opts = {
                errorCorrectionLevel: 'H',
                type: 'terminal',
                quality: 0.95,
                margin: 1,
                color: {
                 dark: '#208698',
                 light: '#FFF',
                },
                  }
                  QRCode.toDataURL(docs1.refer, (err, src) => {
                    if (err) res.send("Something went wrong!!");
                    res.render("final", {
                      qr_code: src,name:docs.name,message:docs1.refer
                    });
                  });
                    
            });
                   // console.log(err)    
          }
          else{
            res.render("login",{
              error: 'Invalid Credential!'
              });
          }
    });
    }
});
app.listen(port, function () {
     console.log(`server is listening on port ${port}`)
});