var User=require('./models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
exports.database='mongodb://localhost:27017/test';

exports.passport=function(passport) {
  passport.serializeUser(function(user, done) {
    console.log("serialize",user.id);
      done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    console.log("deserialize",id);
    User.findOne({'id':id}, function(err, user) {
            done(err, user);
        });
  });
  passport.use(new FacebookStrategy({
    clientID: '1801992176701255',
    clientSecret: '1a21c65567e973064f315e83190137b4',
    callbackURL: "http://localhost:8888/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'id':profile.id}, function(err, user) {
      if (err) { return done(err); }
      if (user) {
        console.log('user already exist');
        done(null, user);
      } else {
        newUser = new User;
        newUser.id=profile.id;
        newUser.name=profile.displayName;
        console.log('created',profile.displayName);
        newUser.save(function(err) {
          if (err) throw err;
          done(null,newUser);
        });
      }
    });
  }));
}
