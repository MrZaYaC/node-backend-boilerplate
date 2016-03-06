'use strict';
var mongoose    = require('mongoose'),
    winston     = require('winston'),
    config      = require(process.cwd() + '/config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
  winston.error('connection error:', err.message);
});
db.once('open', function callback () {
  winston.info("Connected to DB!");
});

module.exports.UserModel = require('./UserModel');
module.exports.UserProfileModel = require('./UserProfileModel');