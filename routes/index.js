var express = require('express');
var router = express.Router();

module.exports = function(app){

   router.get('/', function(req, res, next) {
   	   
         return res.send('Its okay');
       
       
   });

   return router;

};
