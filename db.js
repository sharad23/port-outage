var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/port-outage');
module.exports = mongoose.connection;