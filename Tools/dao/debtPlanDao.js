var express = require('express');
var $debtPlan = require('../model/debtPlanModel');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');


function debtsToClientObject(plan) {
    var ret = {
        debts: []
    }

    if (plan && plan.debts) {
        for (var i = 0; i < plan.debts.length; i++) {
            var debt = plan.debts[i];

            ret.debts.push({
                addDate: debt.addDate,
                totalBalance: debt.totalBalance,
                recurringPayment: debt.recurringPayment,
                payOffPeriod: debt.payOffPeriod,
                name: debt.name,
                description: debt.description,
                payments: debt.payments
            });
        }
    }

    return ret;
}

/* Render debts that were added to the plan on or before the selected date.
 * Use payments that occured on or before the selected date to calculate progress.
 * For now, just return all debts.
 * Potential future optimisation would be to only return specific time periods close
 * to now on the first network request, and then allow users to request further away
 * time periods at a later date.
 */
// 
function queryDebts(userId, selectedDate, callback) {
    $debtPlan.find({_id: ObjectId(userId)}, function(err, result) {
        if (err) {
            callback(err, result);
        } else {
            callback(err, debtsToClientObject(result.length == 0 ? null : result[0]));
        }
    });
}

function addDebt(userId, debt, callback) {
    // Don't want incomplete debts in our database >: (
    try {
        verifyDebt(debt);
    } catch(err) {
        callback(err, null);
        return;
    }

    // Find if the user has an existing debt plan
    $debtPlan.find({_id: ObjectId(userId)}, function(err, result) {
        if (err) {
            callback(err, result);
        } else {
            var plan = null;

            // If the user has an existing plan just append to that.
            // If they don't then make them a new one
            if (result.length == 0) {
                 var newPlan = new $debtPlan();
                 newPlan._id = userId;
                 newPlan.debts = [];
                 plan = newPlan;
            } else {
                plan = result[0];
            }

            // Don't allow users to make multiple debts with the same name'
            for (var i = 0; i < plan.debts.length; i++) {
                var existingDebt = plan.debts[i];
                if (existingDebt.name == debt.name) {
                    callback(new Error('Debt with name ' + debt.name + ' already exists'), null);
                    return;
                }
            }

            // Add the debt to the plan (only in memory so far)
            plan.debts.push(debt);

            // Save the updated plan back to the database
            plan.save(function(err) {
                if (err) {
                    callback(err, null);
                }
                callback(null, {message: "Debt added successfully"});
            });
        }
    });
}

function verifyDebt(debt) {
    // Check if keys exist
    var debtKeys = ['addDate', 'totalBalance', 'recurringPayment', 'payOffPeriod', 'name', 'description'];
    for (var i = 0; i < debtKeys.length; i++) {
        var key = debtKeys[i];
        if (!(key in debt) || debt[key] == null) {
            throw new Error('Key is missing from debt: ' + key);
        }
    }

    //////////////////////////////////////////////
    // Here we can assume that the keys exist.. //
    //////////////////////////////////////////////
    // totalBalance and recurringPayment must be valid numbers
    // Check if it's a number and if it's not not a number because
    // NaN (js value meaning not a number) is of type number.
    if (debt.name.length == 0) {
        throw new Error('Name cannot be empty');
    }
    if (!((typeof debt.totalBalance) == 'number' && !isNaN(debt.totalBalance))) {
        throw new Error('Total balance must be a number');
    }

    if (!moment(debt.addDate, "YYYY-MM-DD", true).isValid()) {
        throw new Error('Supplied date is not valid');
    }

    if (!((typeof debt.recurringPayment == 'number') && !isNaN(debt.recurringPayment))) {
        throw new Error('Recurring payment must be a number');
    }

    // A negative debt is a credit, I don't think we want that.
    if (debt.totalBalance < 0) {
        throw new Error('Total balance cannot be less than zero');
    }
    
    // Monthly payment cannot be more than the total balance
    if (debt.recurringPayment > debt.totalBalance) {
        throw new Error('Recurring payment cannot be more than debt balance');
    }

    // Other payment schedules are unsupported
    if (['monthly', 'weekly', 'fortnightly'].indexOf(debt.payOffPeriod) < 0) {
        throw new Error('Pay off period must be one of monthly, weekly, fortnightly');
    }
}


function addPayment(userId, debtName, payment, callback) {
    try {
        verifyPayment(payment);
    } catch(err) {
        callback(err, null);
        return;
    }

    console.log('payment passed verify');

    $debtPlan.find({_id: ObjectId(userId)}, function(err, result) {
        if (err) {
            callback(err, result);
        } else {
            if (result.length == 0) {
                callback(new Error("Cannot pay without a debt plan"), null);
                return;
            }
            var plan = result[0];
            var found = false;
            for (var i = 0; i < plan.debts.length; i++) {
                var debt = plan.debts[i];

                if (debt.name === debtName) {
                    found = true;

                    var curTotal = 0;
                    for (var p = 0; p < debt.payments.length; p++) {
                        curTotal += debt.payments[p].amount;
                    }
                    console.log('total:');
                    console.log(curTotal);
                    if (curTotal + payment.amount > debt.totalBalance) {
                        console.log('ahhh');
                        callback(new Error("Payment total cannot exceed total balance"), null);
                        return;
                    }

                    // Everything is good! Add it alllll
                    debt.payments.push(payment);

                    console.log('Adding payment...');
                    // Save the updated plan back to the database
                    plan.save(function(err) {
                        if (err) {
                            console.log('errorr');
                            callback(err, null);
                        }
                        console.log('success!');
                        callback(null, {message: "Payment added successfully"});
                    });
                }
            }
            if (!found) {
                callback(new Error("No debts found to pay"), null);
            }
        }
    });
}

function verifyPayment(payment) {
    var paymentKeys = ['paymentDate', 'amount'];

    for (var i = 0; i < paymentKeys.length; i++) {
        var key = paymentKeys[i];
        if (!(key in payment) || payment[key] == null) {
            throw new Error('Key is missing from payment: ' + key);
        }
    }

    if (!((typeof payment.amount == 'number') && !isNaN(payment.amount))) {
        throw new Error('Payment amount must be a number');
    }

    if (payment.amount < 0) {
        throw new Error('Cannot pay negative money');
    }

    if (!moment(payment.paymentDate, "YYYY-MM-DD", true).isValid()) {
        throw new Error('Supplied date is not valid');
    }

    if (moment(payment.paymentDate) > moment(Date.now())) {
        throw new Error('Cannot pay in the future');
    }
}


module.exports = {
    queryDebts: queryDebts,
    addDebt: addDebt,
    addPayment: addPayment,
    verifyDebt: verifyDebt,
    verifyPayment: verifyPayment
}