var express = require('express');
var router = express.Router();
var expenseSnakeDao=require('../dao/adminExpenseSnakeDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.querySnake(req, res, next);
});
router.get('/c_add',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.c_add(req, res, next);
});
router.get('/recommendation_add',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.recommendation_add(req, res, next);
});

router.get('/recommendation_management',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.recommendation_management(req, res, next);
});

router.post('/api',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.api(req, res, next);
});



module.exports = router;