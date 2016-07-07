
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var twitterStrategy = require('passport-twitter').Strategy;

var User = require('../app/models/user.js');


var configAuth = require('./auth');
// console.log(configAuth.facebookAuth.clientID);

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
    // local signup
    passport.use('local-signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            User.findOne({'local.email': email}, function(err, user){
                if(err)     return done(err);

                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // local login
    passport.use('local-login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        User.findOne({'local.email': email}, function(err, user){
            if(err)     return done(err);

            if(!user)
                return done(null, false, req.flash('loginMessage', 'No user found'));
            if(!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Wrong password'));
            return done(null, user);
        });
    }));

    passport.use('facebook', new facebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name'],
    },
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'facebook.id': profile.id}, function(err, user){
                if(err)
                    return done(err);

                if(user){
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err)
                            throw err;

                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('twitter', new twitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
    },
    function(token, tokenSecret, profile, done){
        process.nextTick(function(){
            User.findOne({ 'twitter.id': profile.id }, function(err, user){
                if(err)
                    return done(err);

                if(user){
                    return done(null,user);
                }  else {
                    var newUser = new User();
                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null,newUser);
                    });
                }
            });
        });
    }));
};