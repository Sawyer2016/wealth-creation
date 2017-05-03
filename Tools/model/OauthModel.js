
var mongoose = require("mongoose");	//	

var db =mongoose.createConnection('localhost','OAuth2orizeRecipeTokens');
//var db=mongoose.connect('mongodb://localhost:27017/OAuth2orizeRecipeTokens');

var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	//	
var userSchema = new Schema({
    _id:ObjectId,
	username: String,
	name: String,
	password:String,	
	email:String,
	role:String
	
});	

var OauthModel=db.model('User', userSchema,'User');

module.exports= OauthModel;