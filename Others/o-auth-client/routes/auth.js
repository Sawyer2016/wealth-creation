var express = require('express');
var router = express.Router();
var users = require('./users');
var oauth2 = require('simple-oauth2')({
  clientID: 'testTool',
  clientSecret: 'secretTool',
  site: 'https://localhost:3000',
  tokenPath: '/oauth/token',
  authorizationPath: '/dialog/authorize'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://localhost:3001/auth/callback',
  scope: 'notifications',
  state: '3(#0/!~'
});

// Initial page redirecting to Github
router.get('/', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', function (req, res) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3001/auth/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); res.send("Error");}
    token = oauth2.accessToken.create(result);
    res.redirect("/auth/getUserInfo");
  }
});

router.get('/getUserInfo', function(req, res){
  oauth2.api('GET', '/api/userinfo', {
    access_token: token.token.access_token
  }, function (err, data) {
    if(err) { res.send("Error"); }
    res.redirect('/users?name=' + data.name);
  });
});

module.exports = router;