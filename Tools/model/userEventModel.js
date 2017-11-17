
var mongoose = require("mongoose");	
var db =mongoose.createConnection('localhost','tools');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	
var userEventSchema = new Schema({
	user: String,
	event: String,
	eventID: String,
	username: String
});	

var userEventModel= db.model('user_event', userEventSchema,'user_event');

module.exports= userEventModel;