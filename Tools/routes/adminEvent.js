var express = require('express');
var router = express.Router();
var adminEventDao=require('../dao/adminEventDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
	 adminEventDao.queryEvent(req, res, next);
});
router.get('/event',ensureLoggedIn('/tools/login'), function(req, res, next) {
	res.render('createEvent');
});
router.post('/createEvent',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminEventDao.createEvent(req, res, next);
});
router.get('/eventDetail',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminEventDao.eventDetail(req, res, next);
});
router.get('/sendEmail',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminEventDao.sendEmail(req, res, next);
});
router.get('/deleteEvent',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminEventDao.deleteEvent(req, res, next);
});
router.post('/queryEventByName',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminEventDao.queryEventByName(req, res, next);
});


module.exports = router;