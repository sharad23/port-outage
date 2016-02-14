var express = require('express');
var userSchema = require('../schemas/user');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
     //check the password
     var username = req.body.username;
     var password = req.body.password;

     userSchema.findOne({username: username},function(err,user){
             if(err) return console.log(err);
             user.comparePassword(password,function(err,response){
                    if(err) return console.log(err);
                    if(response === true){
                          res.send("Access Granted");
                    }
                    else if(response === false){
                          res.send("Access Falied");
                    }  
             }); 
     });

});



module.exports = router;
 