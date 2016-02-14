var db = require('../db');
var switchSchema = require('../schemas/switch');
var sync = function(){

	  switchSchema.find({},function(err,data){
            if(err) return console.log(err);
            data.forEach(function(obj){ 
            	 var session = snmp.createSession (obj.ip, "public");
            	 if(obj.flag === 0){
            	 	 obj.ports.forEach(function(port){
            	 	 	     var num  = port.port_no + 1;
            	 	 	     var oids = ["1.3.6.1.2.1.31.1.1.1.18."+(num)];
			                 session.get (oids, function (error, varbinds) {
                                   if(err) console.error (error);
                                   var desc = varbinds[0].value.toString('utf8');
                                   parent.findOneAndUpdate({ 'ports._id': port._id },{ "$set": {"ports.$.description": desc}},function(err,doc) {
                                       if(err) return console.log(err);
							           console.log(port.port_no+" of "+obj.hostname+" has been updated");
							       });
			                 });
            	 	 });
	             }
	             else if(obj.flag === 1){
                      obj.ports.forEach(function(port){
            	 	 	     var num  = port.port_no; 
                             var oids = ["1.3.6.1.4.1.5651.1.2.2.3.1.1.1.5.1."+(num)];
			                 session.get (oids, function (error, varbinds) {
                                   //do operation
                                    if(err) console.error (error);
                                    var desc = varbinds[0].value.toString('utf8');
			                 });
            	 	 }); 
	             }
    
            });
       });
};

console.log('test');
sync();