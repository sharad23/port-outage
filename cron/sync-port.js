var async =  require('async');
var db = require('../db');
var switchSchema = require('../schemas/switch');
var snmp =  require('net-snmp');
var sync = function(cb){
var time = new Date()
	  switchSchema.find({'ports.status.flag': 0},function(err,switches){

             if(err) return console.error(err);
             async.each(switches,function(swt,callback1){
                   async.each(swt.ports,function(port,callback2){
                         if(port.status.flag === 0){
                              if(swt.flag === 1){
                                  var oid = ["1.3.6.1.2.1.2.2.1.8."+(port.port_no)];
                                  var oid_admin = ["1.3.6.1.2.1.2.2.1.7."+(port.port_no)];
                              }
                              else if(swt.flag === 0){
                                  var oid = ["1.3.6.1.2.1.2.2.1.8."+(port.port_no+1)];
                                  var oid_admin = ["1.3.6.1.2.1.2.2.1.7."+(port.port_no+1)];
                              }
                            
                              var session = snmp.createSession (swt.ip, "public");
                              session.get (oid_admin, function (err,varbinds){
                                     if(err){
                                          callback2();
                                          return console.log(err);
                                     } 
                                     console.log(port.port_no+" of "+swt.hostname+" is "+varbinds[0].value );
                                     if(varbinds[0].value == 2){
                                            
                                             port.status.flag = 1;
                                             port.logs.push({from_time: port.status.down_time, to_time:time });
                                             callback2(); 
                                     }
                                     else if(varbinds[0].value == 1){
                                             session.get (oid, function (err,varbinds){
                                                     if(err){
                                                        callback2();
                                                        return console.log(err);
                                                     }
                                                     if(varbinds[0].value === 1){
                                                         
                                                          port.status.flag = 1;
                                                          port.logs.push({from_time: port.status.down_time, to_time:time });
                                                          callback2();
                                                     }
                                             });
                                     }
                                   

                              });
                         
                         }else{

                             callback2();
                         }
                   },
                   function(err){

                        swt.save(function(err,result){
                             if(err) return console.log();
                             callback1();
                        });
                   });
             },
             function(err){
                 if(err) return console.error(err);
                 cb();
             });
            
    });
};
sync(function(data){
   console.log('Completed');
   db.close();
});