'use strict';

const configAuth = require('./auth'),
      GitHubStrategy = require('passport-github').Strategy,
      GoogleStrategy = require('passport-google-oauth20').Strategy,
      LocalStrategy = require('passport-local').Strategy,
      User = require('../models/user');


module.exports = passport => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('github', new GitHubStrategy({

    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL

  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ 'github.id': profile.id });

      if (user)
        return done(null, user);

      
      const newUser = new User();

      newUser.loginAuth = 'github';

      newUser.github.id = profile.id;
      newUser.github.username = profile.username;
      newUser.github.displayName = profile.displayName;
      newUser.github.publicRepos = profile._json.public_repos;

      newUser.nbrClicks.clicks = 0;

      newUser.save( err => {
        if (err) 
          return done(err);

        return done(null, newUser);
      });
      
    } catch(err) {

      return done(err);
    }  
  }));

  passport.use('google', new GoogleStrategy({

    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL

  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ 'google.id': profile.id });

      if (user) 
        return done(null, user);


      const newUser = new User();
  
      newUser.loginAuth = 'google';

      newUser.google.id = profile.id;
      newUser.google.displayName = profile.displayName;

      newUser.nbrClicks.clicks = 0;

      newUser.save( err => {
        if (err) 
          return done(err);

        return done(null, newUser);
      });
      
    } catch (err) {

      return done(err);
    }
  }));

  passport.use('local-login', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

  }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ 'local.email': email.toLowerCase() });
      
      if (!user)
        return done(null, false, req.flash('loginMessage', 'EMAIL/Password combination not found.'));

      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Email/PASSWORD combination not found.'));

      return done(null, user);

    } catch(err) {

      return done(err);
    }
  }));

  passport.use('local-signup', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

  }, async (req, email, password, done) => {
    email = email.toLowerCase();

    try {
      const emailOwner = await User.findOne({ 'local.email': email }),
            nameOwner = await User.findOne({ 'local.displayNameLower': req.body.name.toLowerCase() });

      if (emailOwner)
        return done(null, false, req.flash('signupMessage', 'Email is already taken.'));

      if (nameOwner)
        return done(null, false, req.flash('signupMessage', 'Display Name is already taken.'));
      
      if (password !== req.body['re-password'])
        return done(null, false, req.flash('signupMessage', 'Passwords do not match.'));


      const newUser = new User();
      
      newUser.loginAuth = 'local'

      newUser.local.email = email
      newUser.local.password = newUser.generateHash(password);
      newUser.local.displayName = req.body.name;
      newUser.local.displayNameLower = req.body.name.toLowerCase();
      newUser.local.id = '' + new Date().getTime() + email.charCodeAt(0);

      newUser.nbrClicks.clicks = 0;

      newUser.save (err => {
        if (err) 
          return done(err);

        return done(null, newUser);
      });

    } catch(err) {

      return done(err);
    }
  }));

};