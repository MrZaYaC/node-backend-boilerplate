'use strict';
var passport          = require('passport');

module.exports = function (req, res, next) {
  passport.authenticate('local',
      function (err, user) {
        if (err) {
          return res.boom.forbidden(err.message);
        }

        if (!user) {
          return res.boom.forbidden();
        }

        res.send({token: user.token});
      }
  )(req, res, next);
};