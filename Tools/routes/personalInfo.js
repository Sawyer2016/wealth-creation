var express = require('express');
var router = express.Router();
var personalInfoDao=require('../dao/personalInfoDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
  personalInfoDao.queryByName(req, res, next);
});
router.post('/add',ensureLoggedIn('/tools/login'), function(req, res, next) {
  personalInfoDao.add(req, res, next);
});
module.exports = router;