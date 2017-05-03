
var mongoose = require("mongoose");		
var db =mongoose.createConnection('localhost','tools');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	
var sourceSchema = new Schema({
	name: String,
	introduction:String,
	description: String,
	owner:String,
	star:String,
});	

var sourceModel= db.model('sourceOfIncome', sourceSchema,'sourceOfIncome');

module.exports= sourceModel;