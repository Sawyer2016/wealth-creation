/*jslint node: true */
/*global exports */
'use strict';

var passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
var config = require('../config');

//TODO Configure the connection string for mongo to accept more than just local host

/**
 * Our local static db
 */
var localDb;

/**
 * Gets the static collection of "storage" that is stored within mongo db
 * @param next Calls this when completed
 */
var getCollection = function (next) {
  if (typeof localDb !== "undefined") {
    //The database is already initialized
    var localCollection = localDb.collection('storage');
    next(localCollection);
  } else {
    //We have to initialize the database and its connection
    MongoClient.connect('mongodb://127.0.0.1:27017/' + config.db.dbName, function (err, db) {
      if (err) {
        throw err;
      }
      localDb = db;
      //Add an index to the tokens
      localDb.collection('storage').ensureIndex({token: 1}, function (err, inserted) {
      });
      getCollection(next);
    });
  }
};

var getUserCollection = function (next) {
  if (typeof localDb !== "undefined") {
    //The database is already initialized
    var localCollection = localDb.collection('User');
    next(localCollection);
  } else {
    //We have to initialize the database and its connection
    MongoClient.connect('mongodb://127.0.0.1:27017/' + config.db.dbName, function (err, db) {
      if (err) {
        throw err;
      }
      localDb = db;

      localDb.collection('User').ensureIndex({username: 1}, function (err, inserted) {
      });
      getUserCollection(next);
    });
  }
};

var insertUserDocument = function (_username, _name, _password, _email, next){
  MongoClient.connect('mongodb://127.0.0.1:27017/' + config.db.dbName, function (err, db) {
    if (err) {
      throw err;
    }
    localDb = db;
    localDb.collection('User').insertOne({username: _username, name:_name, password: _password, email: _email, role:'user'}, function(err, result) {
      next(err);
    });
  });
}

exports.getCollection = getCollection;
exports.getUserCollection = getUserCollection;
exports.insertUserDocument = insertUserDocument;