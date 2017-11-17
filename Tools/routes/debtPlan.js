var express = require('express');
var router = express.Router();
var debtPlanDao = require('../dao/debtPlanDao');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', ensureLoggedIn('/tools/login'), function (req, res, next) {
	res.render('debtPlan');
});

router.get('/asJson', ensureLoggedIn('/tools/login'), function(req, res, next) {
	debtPlanDao.queryDebts(req.session.passport.user.user_id, new Date(), function(err, result) {
		if (err) {
			console.log(err);
			res.json({error: err.message});
		} else {
			res.json(result);
		}
	});
});

router.post('/addDebt', ensureLoggedIn('/tools/login'), function (req, res, next) {
	var debt = {
		addDate: req.body.addDate,
		totalBalance: parseFloat(req.body.totalBalance),
		recurringPayment: parseFloat(req.body.recurringPayment),
		payOffPeriod: req.body.payOffPeriod,
		name: req.body.name,
		description: req.body.description,
	};

	debtPlanDao.addDebt(req.session.passport.user.user_id, debt, function(err, result) {
		if (err) {
			console.log(err);
			res.status(500).json({error: err.message});
		} else {
			res.json(result);
		}
	});
});

router.post('/addPayment', ensureLoggedIn('/tools/login'), function(req, res, next) {
	var debtName = req.body.debtName;

	var payment = {
		paymentDate: req.body.paymentDate,
		amount: parseFloat(req.body.amount)
	};

	debtPlanDao.addPayment(req.session.passport.user.user_id, debtName, payment, function(err, result) {
		if (err) {
			console.log(err);
			res.status(500).json({error: err.message});
		} else {
			res.json(result);
		}
	});
});

module.exports = router;