var express = require('express');
var router = express.Router();
var async = require('async');
var socket = require('socket.io');
var switchSchema = require('../schemas/switch');

/*router.get('/:ip/:port/:status',function(req,res,next){

     var ip =  req.params.ip;
     var portVal= parseInt(req.params.port);
     var status = req.params.status;
     var date  = new Date();
     if(status === "off"){
        switchSchema.findOneAndUpdate(
		    { "ip": ip, "ports.port_no": portVal},
		    { 
		        "$set": {
		            "ports.$.status.flag": 0,
		            "ports.$.status.down_time": date
		        }
		    },
		    function(err,result) {
                   if(err) return console.log(err);
                   res.send(result);
		    }
		);
     }
     else if(status === "on"){
         
           switchSchema.findOneAndUpdate(
            { "ip": ip, "ports.port_no": portVal },
            { 
                "$set": {
                    "ports.$.status.flag": 1
                 },
                 "$push": {'ports.$.logs' : {from_time:date, to_time:date} }
            },
            { 
               "upsert": false 
            },
            function(err,result) {
                       if(err) return console.log(err);
                       res.send(result);
            });
       
     }
});
*/

module.exports =  function(app,io){
      
      
      router.get('/:ip/:port/:status',function(req,res,next){
          var ip =  req.params.ip;
          var portVal= parseInt(req.params.port);
          var status = req.params.status;
          var date  = new Date();
          if(status === "off"){
              switchSchema.findOneAndUpdate(
                { "ip": ip, "ports.port_no": portVal},
                { 
                    "$set": {
                        "ports.$.status.flag": 0,
                        "ports.$.status.down_time": date
                    }
                },
                function(err,result) {
                           if(err) return console.log(err);
                           var output =  {};
                           output.port = portVal;
                           output.status = status;
                           output.hostname = result.hostname;
                           output.downTime = new Date();
                           result.ports.forEach(function(port){
                                if(port.port_no == portVal){
                                      output.description = port.description;
                                      output.category =  port.category;
                                      output.port_id = port._id;
                                } 
                           });
                           io.sockets.emit('port-down',output);
                           res.send(result);
                }
              );
              
              
          }
           else if(status === "on"){
               
                 switchSchema.findOneAndUpdate(
                  { "ip": ip, "ports.port_no": portVal },
                  { 
                      "$set": {
                          "ports.$.status.flag": 1
                       },
                       "$push": {'ports.$.logs' : {from_time:date, to_time:date} }
                  },
                  { 
                     "upsert": false 
                  },
                  function(err,result) {
                             if(err) return console.log(err);
                             var output =  {};
                             output.port = portVal;
                             output.status = status;
                             output.hostname = result.hostname;
                             output.downTime = new Date();
                             result.ports.forEach(function(port){
                                  if(port.port_no == portVal){
                                        output.description = port.description;
                                        output.category =  port.category;
                                        output.port_id = port._id;
                                  } 
                             });
                             io.sockets.emit('port-up',output);
                             res.send(result);
                  });
             
           }
      });

      return router;
};