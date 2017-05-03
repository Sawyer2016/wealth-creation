var mongoose = require("mongoose");
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;

var db = mongoose.createConnection('localhost','tools');

var Payment = new Schema({
    paymentDate: String,
    amount: Number
});

var Debt = new Schema({
    addDate: String,
    totalBalance: Number,
    recurringPayment: Number,
    payOffPeriod: String,
    name: String,
    description: String,
    payments: [Payment]
});

var DebtPlan = new Schema({
    debts: [Debt]
})

var debtModel = db.model('debtPlan', DebtPlan, 'debtPlan');

module.exports = debtModel;