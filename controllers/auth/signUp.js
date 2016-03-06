'use strict';
var geoip             = require('geoip-lite'),
    modelsPath        = process.cwd() + '/models',
    UserModel         = require(modelsPath).UserModel,
    UserProfileModel  = require(modelsPath).UserProfileModel;

module.exports = function (req, res, next) {
  var ip = req.body.ip || false;
  var geo = {country: '', city: ''};
  if(ip) {
    geo = geoip.lookup(ip);
  }
  var user = new UserModel({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function (err) {
    if (err) {
      return res.boom.badImplementation(err);
    }
    var profile = new UserProfileModel({
      userId: user.userId,
      country: geo.country,
      city: geo.city
    });
    profile.save(function (err) {
      return res.send({token: user.token});
    })
  });
};