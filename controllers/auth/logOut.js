'use strict';

module.exports = function (req, res, next) {
  if(!req.user){
    return res.boom.forbidden();
  }
  req.user.generateToken();
  req.user.save(function (err, user) {
    if(err){
      return res.boom.badImplementation(err.message);
    }
    res.send();
  });
};