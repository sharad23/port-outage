var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({ 
	                          username: String,
	                          password: String,
	                          dept: String,
	                          role: String 
	                      });

module.exports = mongoose.model('User', userSchema);