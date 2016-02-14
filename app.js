var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var snmp = require ("net-snmp");
var app = express();
var db = require('./db');

var session = snmp.createSession ("118.91.164.1", "public");
/*var oids = ["1.3.6.1.2.1.2.2.1.7."+(7)];
session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        console.log(varbinds); 
    }
});
*/

var oids = ["1.3.6.1.2.1.31.1.1.1.18."+(4)];
session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        console.log(varbinds[0].value.toString('utf8')); 
    }
});


var routes = require('./routes/index')(app);
var auth = require('./routes/auth')(app);
var users = require('./routes/users');
var switches = require('./routes/switches');


// view engine setup
app.set('secret','sharad');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth',auth);
app.use('/', routes);
app.use(function(req,res,next){
    //decode token
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
              var decoded = jwt.decode(token, app.get('secret'));
              req.user = decoded;
              return next();

            } 
        catch (err) {
           res.json({
                       status: 401,
                       message: "Invalid Token"
                    });     
        }
    } 
    else {
      
        res.json({
                    status: 401,
                    message: "No token provided"
                });
    }
    
});

app.use('/users', users);
app.use('/switches',switches);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
