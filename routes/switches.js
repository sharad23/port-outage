var express = require('express');
var switchSchema =  require('../schemas/switch');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
    switchSchema.find({})
                .lean()
                .exec(function(err,data){
                    if(err) return handleError(err);
                    res.send(data);         
                 });

});

router.post('/',function(req, res, next){

	var newSwitch = new switchSchema();
	newSwitch.hostname =  req.body.hostname;
	newSwitch.ip = req.body.ip;
	newSwitch.location = req.body.location;
	newSwitch.flag = req.body.flag;
	if(newSwitch.flag === 0){
         
         for(var i = 1 ; i <= 28; i++){
             
             newSwitch.ports.push( { 
		         	                     port_no : i,
		                                 description: '',
		                                 category: '',
		                                 status:{
		                                 	flag :  1
		                                 }

                                   });
         }
         
    }
    else if(newSwitch.flag === 1){
         
         for(var j = 0 ; j <= 27; j++){
            
             newSwitch.ports.push({ 
		         	                     port_no : j,
		                                 description: '',
		                                 category: '',
		                                 status:{
		                                 	flag :  1
		                                 }

                                     });
          }

    }

	newSwitch.save(function (err,data) {
	    if (err) console.log(err);
	    res.send(data);
	  
	});
});
router.get('/:id',function(req,res,next){
    
    var id = req.params.id;
    switchSchema.findOne({_id: id})
                .lean()
                .exec(function(err,data){
                     if(err) return handleError(err);
                     res.send(data);
                });

});

router.put('/:id',function(req, res, next){
    
      var id = req.params.id;
      switchSchema.findOne({_id: id})
              .exec(function(err,data){
                      if(err) return handleError(err);
                      data.hostname =  req.body.hostname;
          					  data.ip = req.body.ip;
          					  data.location = req.body.location;
                      if(data.flag == req.body.flag){
                          
                          console.log('Equal');
                      }
                      else{
                          
                          console.log('Not Equal');           
                          data.flag = req.body.flag;
                          data.ports = [];
                          if(data.flag === 0){
                   
                              for(var i = 1 ; i <= 28; i++)
                                  data.ports.push({ 
          						         	                     port_no : i,
          						                                 description: '',
          						                                 category: '',
          						                                 status:{
          						                                 	flag :  1
          						                                 }

                                                  });
                          }
          						    else if(data.flag === 1){
          						         
          						         for(var j = 0 ; j <= 27; j++)
          						            data.ports.push({ 
          						         	                     port_no : j,
          						                                 description: '',
          						                                 category: '',
          						                                 status:{
          						                                 	flag :  1
          						                                 }

                                                  });
          						    }
                          
                          
                      }
                      
                      data.save(function(err,result){
                             if(err) return handleError(err);
                             res.send(result);
                      });
                      
                    
                });

});

router.delete('/:id',function(req,res,next){
      
      var id = req.params.id;
      switchSchema.remove({ _id : id }, function (err) {
		  if (err) return handleError(err);
		  res.send('Success');
	  });
});


module.exports = router;
