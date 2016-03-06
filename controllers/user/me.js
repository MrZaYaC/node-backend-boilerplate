'use strict';
var modelPath = process.cwd() + '/models/',
    UserProfile = require(modelPath).UserProfileModel;

module.exports = function (req, res, next) {
  var result = req.user.toObject();
  UserProfile.findOne({userId: req.user.userId}, function(err, profile) {
    if(profile){
      result.profile = profile.toObject();
    }
    res.send(result);
  });
};