var express = require('express');
var router = express.Router();
var userIncomeDao=require('../dao/userIncomeDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userIncomeDao.querySource(req, res, next);
});

router.get('/incomeSourceDetail',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userIncomeDao.incomeSourceDetail(req, res, next);
});
router.get('/rateSource',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userIncomeDao.rateSource(req, res, next);
});
router.get('/SourceOfIncome',ensureLoggedIn('/tools/login'), function(req, res, next) {
	res.render('userCreateIncomeSource');
});
router.post('/createSource',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userIncomeDao.createSource(req, res, next);
});
router.get('/usedSource',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userIncomeDao.usedSource(req, res, next);
});

router.get('/usedSourceList',ensureLoggedIn('/tools/login'), function(req, res, next) {
	userIncomeDao.usedSourceList(req, res, next);
});



module.exports = router;