var async =  require('async');
var db = require('../db');
var snmp =  require('net-snmp');
var switchSchema = require('../schemas/switch');
var async = require('async');
var sync = function(cb){

	  switchSchema.find({},function(err,datas){
            if(err) return console.log(err);
         

            async.each(datas,function(data,callback1){
                 var session = snmp.createSession (data.ip, "public");
                 async.each(data.ports,function(port,callback2){
                          if(data.flag === 0){
                             var num  = port.port_no + 1;
                             var oids = ["1.3.6.1.2.1.31.1.1.1.18."+(num)];
                          }
                          else if(data.flag === 1){
                             var num  = port.port_no; 
                             var oids = ["1.3.6.1.4.1.5651.1.2.2.3.1.1.1.5.1."+(num)];
                          }
                          session.get (oids, function (err, varbinds) {
                                 
                                 if(err) return console.error (err);
                                 var desc = varbinds[0].value.toString('utf8');
                                 switchSchema.findOneAndUpdate({ 'ports._id': port._id },{ "$set": {"ports.$.description": desc}},function(err,doc) {
                                     if(err) return console.log(port.port_no+" of "+data.hostname+" has not been updated");
                                     console.log(port.port_no+" of "+data.hostname+" has been updated");
                                     callback2();
                                     
                                 });
                          });
                 },
                 function(err){
                      callback1();
                 });
            },
            function(err){
                  console.log('Ended');
                  cb();
            });
    });
};

sync(function(){
      //closing monsoogose connection
      db.close();
});


