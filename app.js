'use strict';
var app               = require('express')(),
    boom              = require('express-boom'),
    winston           = require('winston'),
    bodyParser        = require('body-parser'),
    passport          = require('passport'),
    config            = require('./config/'),
    passportStrategy  = require('./components/passportStrategy');

app.use(boom());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
//app.use(passport.session());
app.use(setHeaders);
app.use('/', require('./routes'));

// Error handling
app.use(function (req, res) {
  // Error 404
  res.boom.notFound('Route not found');
});

app.use(function (err, req, res, next) {
  if (err.isBoom && err.output.statusCode === 400) {
    // Error 400 - Bad request
    res.boom.badRequest(err.data.map(function (item) {
      return item.message;
    }).join('\n'));
  }
  else {
    // Error 500 - Application error
    winston.error('Error: %s', err.message, err.stack);
    res.boom.badImplementation();
  }
});

var server = app.listen(config.get('app:port'), function () {
  winston.info('API listening on port %d', server.address().port);
});

process.on('uncaughtException', function (err) {
  if (err.errno === 'EADDRINUSE' || err.errno === 'EACCES') {
    winston.error('Error when try to listen %d port', config.get('app:port'));
  }
  else {
    winston.error(err);
  }

  process.exit(1);
});

function setHeaders(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Cache-Control, Content-Type, X-Requested-With, X-App-Language');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  next();
}
