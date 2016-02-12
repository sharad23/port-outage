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
	newSwitch.hostname =  req.body.name;
	newSwitch.ip = req.body.ip;
	newSwitch.location = req.body.location;
	newSwitch.type = req.body.type;
	if(newSwitch.type === 0){
         
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
    else if(newSwitch.type === 1){
         
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
                .lean()
                .exec(function(err,data){
                     if(err) return handleError(err);
                      data.hostname =  req.body.name;
					  data.ip = req.body.ip;
					  data.location = req.body.location;
					  if(data.type == req.params.type){

                      }
                      else{
                           
                           data.type = req.params.type;
                           if(newSwitch.type === 0){
         
                                for(var i = 1 ; i <= 28; i++)
                                   newSwitch.ports[i] =  { 
							         	                     port_no : i,
							                                 description: '',
							                                 category: '',
							                                 status:{
							                                 	flag :  1
							                                 }

                                                         };
                           }
						    else if(newSwitch.type === 1){
						         
						         for(var j = 0 ; j <= 27; j++)
						         newSwitch.ports[j] =  { 
						         	                     port_no : j,
						                                 description: '',
						                                 category: '',
						                                 status:{
						                                 	flag :  1
						                                 }

						                               };
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
