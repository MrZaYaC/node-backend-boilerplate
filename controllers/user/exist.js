'use strict';
var modelsPath    = process.cwd() + '/models',
    UserModel     = require(modelsPath).UserModel;

module.exports = function (req, res, next) {
  UserModel.findOne({username: req.query.username}, function (err, user) {
    if(err) {
      return res.boom.forbidden();
    }
    if(user){
      return res.send({result: true});
    } else {
      return res.send({result: false});
    }
  })
};