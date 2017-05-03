/*jslint node: true */
/*global exports */
'use strict';

//TODO Document all of this

var passport = require('passport');
var login = require('connect-ensure-login');
var users = require('./mongodb/users');

exports.index = function (req, res) {
  if (!req.query.code) {
    res.render('index');
  } else {
    res.render('index-with-code');
  }
};

exports.loginForm = function (req, res) {
  res.render('login');
};

exports.login = [
  passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login', failureFlash: true})
];

exports.logout = function (req, res) {
  req.logout();
  res.redirect(req.query.callback);
};

exports.account = [
  login.ensureLoggedIn(),
  function (req, res) {
    res.render('account', {user: req.user});
  }
];

exports.registerForm = function (req, res){
  res.render('register');
}

exports.register = function (req, res){
  users.insertUser(req.body.username, req.body.name, req.body.password, req.body.email, function(error){
    if(error){
      console.log('error');
      res.redirect('/sign');
    } else {
      passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login'})(req, res, function () {
        res.redirect('/');
      });
    }
  });
}