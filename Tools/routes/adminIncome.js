var express = require('express');
var router = express.Router();
var adminIncomeDao=require('../dao/adminIncomeDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
	 adminIncomeDao.querySource(req, res, next);
});
router.get('/incomeSourceDetail',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminIncomeDao.incomeSourceDetail(req, res, next);
});
router.get('/deleteSource',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminIncomeDao.deleteSource(req, res, next);
});
router.get('/SourceOfIncome',ensureLoggedIn('/tools/login'), function(req, res, next) {
	res.render('createSourceOfIncome');
});
router.post('/createSource',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminIncomeDao.createSource(req, res, next);
});
router.post('/querySourceByName',ensureLoggedIn('/tools/login'), function(req, res, next) {
	adminIncomeDao.querySourceByName(req, res, next);
});

module.exports = router;