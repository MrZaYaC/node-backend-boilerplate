'use strict';
var FB                = require('fb'),
    geoip             = require('geoip-lite'),
    config            = require(process.cwd() + '/config'),
    modelsPath        = process.cwd() + '/models',
    UserModel         = require(modelsPath).UserModel,
    UserProfileModel  = require(modelsPath).UserProfileModel;

module.exports = function (req, res, next) {
  var ip = req.query.ip || false;
  var geo = {country: '', city: ''};
  if(ip) {
    geo = geoip.lookup(ip);
  }
  FB.setAccessToken(req.query.access_token);
  FB.napi('/me', {fields: ['id', 'email', 'first_name', 'last_name', 'gender', 'address', 'website', 'birthday']}, function(err, data){
    if(err){
      return res.boom.badImplementation(err.message);
    }
    if(!data.email){
      return res.boom.badImplementation();
    }
    UserModel.findOne({username: data.email}, function (err, user) {
      if(err){
        return res.boom.badImplementation();
      }
      if(user){
        res.send({token: user.token});
      } else {
        var user = new UserModel({
          username: data.email,
          password: req.query.access_token
        });
        user.save(function (err) {
          if(err){
            return res.boom.badImplementation(err.message);
          }
          var profile = new UserProfileModel({
            userId: user.userId,
            firstName: data.first_name,
            lastName: data.last_name,
            gender: data.gender,
            birthday: data.birthday,
            website: data.website,
            country: geo.country,
            city: geo.city
          });
          profile.save(function (err) {
            res.send({token: user.token});
          })
        })
      }
    });
  });
};