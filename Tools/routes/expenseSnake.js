var express = require('express');
var router = express.Router();
var expenseSnakeDao=require('../dao/expenseSnakeDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.querySnake(req, res, next);
});
router.get('/u_add',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.u_add(req, res, next);
});
router.get('/u_chart',ensureLoggedIn('/tools/login'), function(req, res, next) {
	expenseSnakeDao.u_chart(req, res, next);
});

router.post('/api',ensureLoggedIn('/tools/login'), upload.single('image'), function(req, res, next) {
	expenseSnakeDao.api(req, res, next);
});

module.exports = router;