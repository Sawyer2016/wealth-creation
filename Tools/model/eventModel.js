
var mongoose = require("mongoose");		
var db =mongoose.createConnection('localhost','tools');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	
var eventSchema = new Schema({
	name: String,
	description: String,
	time:String,	
	location:String
});	

var eventModel= db.model('event', eventSchema,'event');

module.exports= eventModel;