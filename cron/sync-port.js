var switchSchema = require('../schemas/switch');
var sync = function(){

	  switchSchema.find({},function(err,data){
            if(err) return console.log(err);
            data.forEach(function(obj){ 
            	  console.log(obj); 
            });
       });
};
sync();