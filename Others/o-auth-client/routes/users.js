var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log(req);
  res.render('users',{ username :  req.query.name});
});

module.exports = router;