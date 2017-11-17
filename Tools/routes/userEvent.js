var express = require('express');
var router = express.Router();
var userEventDao=require('../dao/userEventDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userEventDao.queryEvent(req, res, next);
});

router.get('/eventDetail',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userEventDao.eventDetail(req, res, next);
});

router.post('/bookEvent',ensureLoggedIn('/tools/login'), function(req, res, next) {	
	userEventDao.bookEvent(req, res, next);
});

router.post('/cancelBook',ensureLoggedIn('/tools/login'), function(req, res, next) {
	
 userEventDao.cancelBook(req, res, next);
});
router.post('/searchEvent',ensureLoggedIn('/tools/login'), function(req, res, next) {
	
 userEventDao.searchEvent(req, res, next);
});




module.exports = router;