var express = require('express');
var router = express.Router();
var async = require('async');
var switchSchema = require('../schemas/switch');

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
                   res.send(result);
		    }
		);
     }
     else if(status === "on"){
         
     	switchSchema.findOne({'ip': ip },function(err,data){
     	 	      if(err)  return console.log(err);  
                  async.each(data.ports,function(port,cb){
                       if(port.port_no === portVal){
                       	   port.status.flag =  1;
                       	   port.logs.push({ from_time: date, to_time: date  });
                       	   data.save(function(err,result){
                                  if(err) return console.log(err);
                                  cb();
                       	   });
                          
                       }
                       else{
                           
                           cb();
                       }
                  },
                  function(err){
                       if(err) return console.log(err);
                       res.send(data);
                  });
     	        
     	          
     	 });
     }
});

module.exports =  router;