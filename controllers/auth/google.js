'use strict';
var passport          = require('passport'),
    config            = require(process.cwd() + '/config'),
    modelsPath        = process.cwd() + '/models',
    UserModel         = require(modelsPath).UserModel,
    UserProfileModel  = require(modelsPath).UserProfileModel;

module.exports = function (req, res, next) {
  passport.authenticate('google-plus-token', function (err, user, info) {
    if(err) { return res.boom.badImplementation(err.message);}
    if(info) { return res.boom.unauthorized(info.message);}
    return res.send({token: user.token});
  })(req, res, next);
};