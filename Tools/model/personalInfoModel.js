
var mongoose = require("mongoose");	//	

var db =mongoose.createConnection('localhost','tools');
//mongoose.connect('mongodb://localhost:27017/tools');


var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	//	
var infoSchema = new Schema({
	age: String,
	address: String,
	phone:String,	
	income:String,
	occupation:String,
	interests:String,
	name:String
});	

var perInfoModel= db.model('personal_info', infoSchema,'personal_info');

module.exports= perInfoModel;