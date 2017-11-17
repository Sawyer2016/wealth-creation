
var mongoose = require("mongoose");	
var db =mongoose.createConnection('localhost','tools');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	
var usedSourceSchema = new Schema({
	user: String,
	sourceName: String
	
});	

var usedSourceModel= db.model('used_source', usedSourceSchema,'used_source');

module.exports= usedSourceModel;