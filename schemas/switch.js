var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logSchema = new Schema({ 
	                          from_time: Date,
	                          to_time: Date 
	                      });

var portSchema  = new Schema({ 
	                          port_no: Number,
	                          description: String,
	                          category: String,
	                          status:{
	                          	   flag:Number,
	                          	   down_time:Date
	                          },
	                          logs:[ logSchema ]  
	                      });

var switchSchema = new Schema({
                                hostname: String,
                                ip: String,
                                location: String,
                                flag: Number,
                                community: String,
                                ports: [ portSchema ],
                                added_by: { type: Schema.Types.ObjectId, ref: 'User' }
                             
                             });




module.exports = mongoose.model('Switch', switchSchema);