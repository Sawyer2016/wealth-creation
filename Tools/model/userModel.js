
var mongoose = require("mongoose");	



var db =mongoose.createConnection('localhost','tools');
db.on('error', console.error.bind(console, 'connect failure£º'))
db.once('open', (callback) => {
  console.log('MongoDB connect successfully£¡£¡')
})
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	
var userSchema = new Schema({
	username: String,
	name: String,
	password:String,	
	email:String,
	type:String
	
});	

var userModel= db.model('OAuth2orizeRecipeTokens', infoSchema,'OAuth2orizeRecipeTokens');

Model.exports= userModel;