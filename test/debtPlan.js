var assert = require('assert');
var chai = require('chai');
var debtPlan = require('../Tools/dao/debtPlanDao');

var expect = chai.expect;

describe('Debt Plan', function () {
  describe('#verifyDebt', function() {
    it('should return true for valid debts', function() {
      var debt = {
        addDate: '2016-10-19',
        totalBalance: 100,
        recurringPayment: 10,
        payOffPeriod: 'weekly',
        name: 'rawr',
        description: ''
      };
      expect(debtPlan.verifyDebt.bind(debtPlan, debt)).to.not.throw(Error);
    });
    it('should raise an exception if total balance is not a number', function() {
      var debt = {
        addDate: '2016-10-19',
        totalBalance: 'not a number',
        recurringPayment: 10,
        payOffPeriod: 'weekly',
        name: 'rawr',
        description: ''
      };

      expect(debtPlan.verifyDebt.bind(debtPlan, debt)).to.throw('Total balance must be a number');
    });
    it('should raise an exception if recurring payment is not a number', function() {
      var debt = {
        addDate: '2016-10-19',
        totalBalance: 100,
        recurringPayment: 'not a number',
        payOffPeriod: 'weekly',
        name: 'rawr',
        description: ''
      };

      expect(debtPlan.verifyDebt.bind(debtPlan, debt)).to.throw('Recurring payment must be a number');
    });
    it('should raise exception for negative balances', function() {
      var debt = {
        addDate: '2016-10-19',
        totalBalance: -100,
        recurringPayment: 10,
        payOffPeriod: 'weekly',
        name: 'rawr',
        description: ''
      };

      expect(debtPlan.verifyDebt.bind(debtPlan, debt)).to.throw('Total balance cannot be less than zero');
    });
    it('should raise exception for recurring payments > balance', function() {
      var debt = {
        addDate: '2016-10-19',
        totalBalance: 10,
        recurringPayment: 100,
        payOffPeriod: 'weekly',
        name: 'rawr',
        description: ''
      };

      expect(debtPlan.verifyDebt.bind(debtPlan, debt)).to.throw('Recurring payment cannot be more than debt balance');
    });
    it('should raise exception for payment periods that are not monthly, weekly, fortnightly', function() {
      var debt = {
        addDate: '2016-10-19',
        totalBalance: 100,
        recurringPayment: 10,
        payOffPeriod: 'hello world',
        name: 'rawr',
        description: ''
      };

      expect(debtPlan.verifyDebt.bind(debtPlan, debt)).to.throw('Pay off period must be one of monthly, weekly, fortnightly');
    });
    it('should raise exception if name is empty', function() {
      var debt = {
        addDate: '2016-10-19',
        totalBalance: 100,
        recurringPayment: 10,
        payOffPeriod: 'monthly',
        name: '',
        description: ''
      };

      expect(debtPlan.verifyDebt.bind(debtPlan, debt)).to.throw('Name cannot be empty');
    });
    it('should raise an exception if payment amount is not a number', function() {
      var payment = {
        paymentDate: '2016-10-19',
        amount: 'hello'
      };

      expect(debtPlan.verifyPayment.bind(debtPlan, payment)).to.throw('Payment amount must be a number');
    });
    it('should raise an exception if payment amount is less than zero', function() {
      var payment = {
        paymentDate: '2016-10-19',
        amount: -1
      };

      expect(debtPlan.verifyPayment.bind(debtPlan, payment)).to.throw('Cannot pay negative money');
    });
    it('should raise an exception if date is not valid', function() {
      var payment = {
        paymentDate: 'hahaha',
        amount: 0
      };

      expect(debtPlan.verifyPayment.bind(debtPlan, payment)).to.throw('Supplied date is not valid');
    });
    it('should raise an exception if amount is missing', function() {
      var payment = {
        paymentDate: 'hahaha'
      };

      expect(debtPlan.verifyPayment.bind(debtPlan, payment)).to.throw('Key is missing from payment: amount');
    });
    it('should raise an exception if payment date is in the future', function() {
      var payment = {
        paymentDate: '2020-01-01',
        amount: 666
      };

      expect(debtPlan.verifyPayment.bind(debtPlan, payment)).to.throw('Cannot pay in the future');
    });
  });
});