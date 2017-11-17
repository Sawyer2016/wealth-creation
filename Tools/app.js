var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var routes = require('./routes/index');
var personalInfo = require('./routes/personalInfo');
var adminEvent = require('./routes/adminEvent');
var userEvent = require('./routes/userEvent');
var userIncome = require('./routes/userIncome');
var debtPlan = require('./routes/debtPlan');
var adminIncome = require('./routes/adminIncome');
var admin = require('./routes/admin');
var adminExpense = require('./routes/adminExpenseSnake');
var expenseSnake = require('./routes/expenseSnake');

var app = express();
var ejs = require('ejs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/tools', express.static(path.join(__dirname, 'public')));

app.use('/tools', routes);
app.use('/tools/personalInfo', personalInfo);
app.use('/tools/adminEvent', adminEvent);
app.use('/tools/userEvent', userEvent);
app.use('/tools/adminExpenseSnake', adminExpense);
app.use('/tools/userIncome', userIncome);
app.use('/tools/debtPlan', debtPlan);
app.use('/tools/adminIncome', adminIncome);
app.use('/tools/admin', admin);
app.use('/tools/expenseSnake', expenseSnake);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error', {

    message: err.message,
    error: {}
  });
});

module.exports = app;
