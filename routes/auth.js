var express = require('express');
var userSchema = require('../schemas/user');
var jwt = require('jwt-simple');
var router = express.Router();

module.exports = function(app){
     router.post('/', function(req, res, next) {
             //check the password
             var username = req.body.username;
             var password = req.body.password;

             userSchema.findOne({username: username},function(err,user){
                     if(err) return console.log(err);
                     if(!user){ 
                        //res.writeHead(401);
                        //res.write('Invalid username');
                        //res.end();
                        res.json({ status: 401,
                                   message: 'Invalid username'
                                 });
                     }
                     else{
                         user.comparePassword(password,function(err,response){
                                if(err) return console.log(err);
                                if(response === true){
                                      var secret = app.get('secret');
                                      var payload = user;
                                      var token = jwt.encode(payload, secret);
                                      //res.writeHead(200);
                                      //res.write(token);
                                      //res.end();
                                      res.json({status: 200,
                                                token: token,
                                                message: 'Success' 
                                              });
                                }
                                else if(response === false){
                                      //res.writeHead(401);
                                      //res.write('Invalid password');
                                      //res.end();
                                      res.json({status: 401,
                                                message: 'Invalid password'
                                               });
                                }  
                         });
                     } 
             });

     });

     return router;

};
 