'use strict';

const dir = process.cwd();

const ClickHandler = require(dir + '/app/controllers/clickHandler.server.js');

module.exports = function(app, passport) {
  let clickHandler = new ClickHandler();


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    else res.redirect('/');
  }


  app.route('/')
    .get( (req, res) => {
      if (req.isAuthenticated()) res.redirect('/content');
      else res.render('index');
    });
    
  app.route('/signup')
    .get( (req, res) => {
      res.render('signup', { message: req.flash('signupMessage') });
    });

  app.route('/login')
    .get( (req, res) => {
      res.render('login', { message: req.flash('loginMessage') });
    });

  app.route('/logout')
    .get( (req, res) => {
      req.logout();
      res.redirect('/login');
    });

  app.route('/content')
    .get(isLoggedIn, (req, res) => {
      res.render('content');
    });
    
  app.route('/profile')
    .get(isLoggedIn, (req, res) => {
      res.render('profile', { user: req.user });
    });

  app.route('/api/:id')
    .get(isLoggedIn, (req, res) => {
      res.json(req.user);
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/content',
      failureRedirect: '/login'
    }));

  app.route('/auth/google')
    .get(passport.authenticate('google', { scope: ['profile'] }));

  app.route('/auth/google/callback')
    .get(passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
      res.redirect('/content');
    });

  app.route('/auth/local-signup')
    .post(passport.authenticate('local-signup', {
      successRedirect: '/content',
      failureRedirect: '/signup'
    }));

  app.route('/auth/local-login')
    .post(passport.authenticate('local-login', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('/content');
      }
    );

  app.route('/api/:id/clicks')
    .get(isLoggedIn, clickHandler.getClicks)
    .post(isLoggedIn, clickHandler.addClick)
    .delete(isLoggedIn, clickHandler.resetClicks);

};
