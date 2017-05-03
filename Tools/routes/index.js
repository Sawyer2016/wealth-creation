var express = require('express');
var router = express.Router();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');
var https = require('https');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var token;

var os = require("os");
var hostname = os.hostname();


var multer = require('multer');
var upload = multer({ dest: 'uploads/' });


//Only for debugging
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/* GET home page. */
router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
  res.render('index');
});

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://' + hostname + '/dialog/authorize',
    tokenURL: 'https://' + hostname + '/oauth/token',
    clientID: 'testTool',
    clientSecret: 'secretTool',
    scope: 'read-user-account',
    callbackURL: 'http://' + hostname + '/tools/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    https.get({
      hostname: hostname,
      port: 443,
      path: '/api/userinfo',
      headers:{
        "Authorization": "Bearer " + accessToken
      }
    }, (res) => {
      var body ='';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        // console.log(body);
        var user = JSON.parse(body);
        return cb(null, user);
      });
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });
  }
));

router.get('/auth',passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', { failureRedirect: '/tools/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    if(req.user.role == 'admin'){
      res.redirect('/tools/admin');
    }
    else if(req.user.role == 'user'){
      res.redirect('/tools');
    }
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/logout',ensureLoggedIn('/tools/login'), function (req, res) {
  req.logout();
  var url = 'https://' + hostname + '/logout?callback=http://' + hostname +  '/tools';
  res.redirect(url);
});


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = router;


