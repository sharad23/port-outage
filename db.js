var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ports');
module.exports = mongoose.connection;