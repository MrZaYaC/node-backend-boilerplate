'use strict';
var passport                  = require('passport'),
    LocalStrategy             = require('passport-local').Strategy,
    BearerStrategy            = require('passport-http-bearer').Strategy,
    GooglePlusTokenStrategy   = require('passport-google-plus-token').Strategy,
    geoip                     = require('geoip-lite'),
    modelsPath                = process.cwd() + '/models',
    UserModel                 = require(modelsPath).UserModel,
    UserProfileModel          = require(modelsPath).UserProfileModel,
    config                    = require(process.cwd() + '/config');

passport.use(new LocalStrategy(
    function(username, password, done) {
      UserModel.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.checkPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
));

passport.use(new BearerStrategy(
    function (token, done) {
      if(!token){
        return done(null, false, { message: 'Incorrect token.' });
      }
      UserModel.findOne({ token: token }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect token.' });
        }
        return done(null, user);
      });
    }
));

passport.use(new GooglePlusTokenStrategy({
      clientID: config.get('google:clientId'),
      clientSecret: config.get('google:clientSecret'),
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      var ip = req.query.ip || false;
      var geo = {country: '', city: ''};
      if(ip) {
        geo = geoip.lookup(ip);
      }
      var data = {
        username: profile._json.emails[0].value,
        password: accessToken,
        firstName: profile._json.name.givenName,
        lastName: profile._json.name.familyName,
        gender: profile._json.gender,
        birthday: '',
        website: '',
        city: geo.city,
        country: geo.country
      };
      findOrCreate(data, function (err, user) {
        if(err){
          return done(err, null);
        }
        return done(null, user);
      });
    }
));

module.exports.isAuthenticated = passport.authenticate('bearer', { session : false });

function findOrCreate(data, callback) {
  UserModel.findOne({username: data.username}, function (err, user) {
    if(err){
      return callback(err);
    }
    if(user){
      return callback(null, user);
    } else {
      var user = new UserModel({
        username: data.username,
        password: data.password
      });
      user.save(function (err) {
        if(err){
          return callback(err);
        }
        var profile = new UserProfileModel({
          userId: user.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          birthday: data.birthday,
          website: data.website,
          country: data.country,
          city: data.city
        });
        profile.save(function (err) {
          return callback(null, user);
        })
      })
    }
  });
}


