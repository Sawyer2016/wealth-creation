
var mongoose = require("mongoose");		
var db =mongoose.createConnection('localhost','tools');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;	
var expanseSnakeSchema = new Schema({
	name: String,
	price: String,
	description:String
});	

var expanseSnakeModel= db.model('expanseSnake', expanseSnakeSchema,'expanseSnake');

module.exports= expanseSnakeModel;