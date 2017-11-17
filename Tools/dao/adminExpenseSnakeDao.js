var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var db_url = 'mongodb://localhost:27017/tools';
var ObjectID = require('mongodb').ObjectID;
var http = require("http");
var url = require("url");
var querystring = require('querystring');
var path = require("path");
var fs   = require("fs");
var DIR = 'views';    
var ejs  = require('ejs');
var mine=require('./mine').types;
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' }).single('image');

module.exports = {
	 
	querySnake:function(request,response,next){
		var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		var user=request.session.passport.user.user_id;
	 var _data={};
		 pathname+="adminExpenseSnake.html";
	console.log(pathname); 
	MongoClient.connect(db_url, function(err, db) {
			  // Create a collection we want to drop later
			  var col = db.collection('category');
			  // Show that duplicate records got dropped
			  col.find({}).toArray(function(err, items) {
				 _data.list=items;
				 console.log(_data);
				    get_file(pathname,_data,response);
				db.close();
			  });
			});
			
	
	},
	c_add:function(request,response,next){
		 var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		pathname+=".html";
		var _data={
				 _id:0,
				 category_name:'',
				 des:''
				};
			if(data.id == undefined)
			{
				get_file(pathname,_data,response);
			}
			else
			{
				MongoClient.connect(db_url, function(err, db) {
				  // Create a collection we want to drop later
				  var col = db.collection('category');
				  
				  var obj_id = new ObjectID(data.id);
				  col.find({"_id":obj_id}).toArray(function(err, r) {
					   if (err) {
						 console.log('[query] - :'+err);
							return;
						 }
						 console.log(r[0]);
						 _data=r[0];
				 
				     get_file(pathname,_data,response);
					  
					  db.close();
					});

				});
				
			 
 
			}

	},

	recommendation_management:function(request,response,next){
		var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		// var user=request.session.passport.user.user_id;
	 	var _data={};
		pathname+=".html";
		
		request.setEncoding('utf8');
			
			MongoClient.connect(db_url, function(err, db) {
						  // Create a collection we want to drop later
						  var col = db.collection('recommendation');
						  // Show that duplicate records got dropped
						  col.find({}).toArray(function(err, items) {
						  	_data.recommendation = items;
							
							MongoClient.connect(db_url, function(err, db) {
							  // Create a collection we want to drop later
							  var col = db.collection('category');
							  // Show that duplicate records got dropped
							  col.find({}).toArray(function(err, items) {
							 
								if (err) {
									console.log('[query] - :'+err);
									return;
								}
							    _data.c_list=items;
							    get_file(pathname,_data,response);
								db.close();
							  });
							});

							db.close();
						  });
						});
	},
	
	recommendation_add:function(request,response,next){
		var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		pathname+=".html";
		var _data={
				 _id:0,
				 cid:'',
				 recommend_product:'',
				 description:'',
				 recommend_price:'',
				 product_url:'' 
				};
				
				MongoClient.connect(db_url, function(err, db) {
			  // Create a collection we want to drop later
			  var col = db.collection('category');
			  // Show that duplicate records got dropped
			  col.find({}).toArray(function(err, items) {
			 
				 console.log(_data);
				   if (err) {
					
					   console.log('[query] - :'+err);
				  return;
			   	}
			   var c_list=items;
			   
			     _data.c_list=c_list;
				 if(data.id == undefined)
					{
						get_file(pathname,_data,response);
					}
					else
					{
						
						MongoClient.connect(db_url, function(err, db) {
				  // Create a collection we want to drop later
				  var col = db.collection('recommendation');
				  
				  var obj_id = new ObjectID(data.id);
				  col.find({"_id":obj_id}).toArray(function(err, r) {
					   if (err) {
						 console.log('[query] - :'+err);
							return;
						 }
						 console.log(r[0]);
						 _data=r[0];
				 		 _data.c_list=c_list;
				     get_file(pathname,_data,response);
					  
					  db.close();
					});

				});
						  
					}
				db.close();
			  });
			});
	},
	api:function(request,response,next){
		var user=request.session.passport.user.user_id;
		 var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		if(data.act)
		 {
			 switch(data.act){
				 case "c_list":

					//Do sql
					connection.query('SELECT * from category', function(err, rows, fields) { 
					 if (err) {
						  
							 console.log('[query] - :'+err);
						return;
					 }
						 
						 show_res(1,'ok',rows);
					});  
					 
                    break;
				case "c_add":
	
				 		var post=request.body;
					 	
					
							if(post.id==0)
							{
							console.log('id=0');	
							 MongoClient.connect(db_url, function(err, db) {
							  // Create a collection we want to drop later
							  var col = db.collection('category');
							  var _dbDate=[{"category_name":post.category_name,"des":post.des}];
 						       
							  col.insert(_dbDate, function(err, result) {
								   if (err) {
									 console.log('[query] - :'+err);
										return;
									 }
									 
								 show_res(1,'ok',result);
								  db.close();
								});

							});
								
								
								
							}
							else
							{
								 
								 MongoClient.connect(db_url, function(err, db) {
							  // Create a collection we want to drop later
							  var col = db.collection('category');
							  var _dbDate={$set:{"category_name":post.category_name,"des":post.des}};
 						       var obj_id = new ObjectID(post.id);
  								var whereStr  = { "_id" : obj_id };
								console.log(_dbDate);
							  col.update(whereStr, _dbDate,function(err, result) {
								   if (err) {
									 console.log('[query]u - :'+err);
										return;
									 }
									 
								 show_res(1,'ok',result);
								  db.close();
								});

							}); 
							}
							      
					 
                    break;
				case "c_del":
						if(data.id != undefined)
						{
							
							MongoClient.connect(db_url, function(err, db) {
							  // Create a collection we want to drop later
							  var col = db.collection('category');
							  
 						      var obj_id = new ObjectID(data.id);
							  col.remove({"_id":obj_id},{safe:true}, function(err, r) {
								   if (err) {
									 console.log('[query] - :'+err);
										return;
									 }
									 
								 show_res(1,'ok',r);
								  db.close();
								});

							});
							
						}
						else
						{
							show_res(false,'Parameter is not correct',[]);	
						}
					 
                    break;
                    
            case "recommendation_add":
		 			var post=request.body;

					if(post.id==0)
					{

						MongoClient.connect(db_url, function(err, db) {
						  // Create a collection we want to drop later
						  var col = db.collection('category');
						  
						  var obj_id = new ObjectID(post.cid);
						  col.find({"_id":obj_id}).toArray(function(err, r) {
							   if (err) {
								 console.log('[query] - :'+err);
									return;
								 }
								 console.log('r[0]'+r[0]);
								 _data=r[0];
						 
						      var col = db.collection('recommendation');
							  var _dbDate=[{"cid":_data['_id'],"category_name":_data['category_name'],"recommend_product":post.recommend_product,"description":post.description,"recommend_price":post.recommend_price,"product_url":post.product_url}];
							  console.log('recommend_product='+_data['recommend_product']); 
							  
							   
							  col.insert(_dbDate, function(err, result) {
								   if (err) {
									 console.log('[query] - :'+err);
										return;
									 }
									 
								 show_res(1,'ok',result);
								  //db.close();
								});  
							  db.close();
							});
		
						});
								
					}
                    break;		
                    
				case "recommendation_del":
						if(data.id != undefined)
						{
							 console.log("keyi zhao dao shuju");
							 MongoClient.connect(db_url, function(err, db) {
							  // Create a collection we want to drop later
							  var col = db.collection('recommendation');
							  
 						      var obj_id = new ObjectID(data.id);
							  col.remove({"_id":obj_id},{safe:true}, function(err, r) {
								   if (err) {
									 console.log('[query] - :'+err);
										return;
									 }
									 
								 show_res(1,'ok',r);
								  db.close();
								});

							});
							 

						}
						else
						{
							show_res(false,'Parameter is not correct',[]);	
						}
					 
                    break;	
				default:
				return show_res(false,'Parameter is not correct',[]);	
			 }
		 }
		 function show_res(code ,msg ,items)
	 {
		 response.writeHead(200, {"Content-Type": "text/json"});
		 data ={};
		data.msg=msg;
		data.code=code;
		data.data=items;
		response.write(JSON.stringify(data) );
		 
		response.end();
		return;
	 }
	}
	
}
function get_file(pathname,data,response)
	  {
		  var realPath = path.join(DIR, pathname);
		  var ext = path.extname(realPath);
			  ext = ext ? ext.slice(1) : 'unknown';
			  console.log(realPath);
			  fs.exists(realPath, function (exists) {
			  if (!exists) {
				  response.writeHead(404, {"Content-Type": "text/html"});
				  response.end("<h1>404 Not Found</h1>");
				  response.end();
			  } else {
				  fs.readFile(realPath, "binary", function (err, file) {
					  if (err) {
						  response.writeHead(500, {
							  'Content-Type': 'text/plain'
						  });
						  response.end(err);
					  } else {
						  var contentType = mine[ext] || "text/plain";
						  response.writeHead(200, {
							  'Content-Type': contentType
						  });
						  var  html = ejs.render(file,data,{filename:realPath});
						  response.write(html, "binary");
						  response.end();
					  }
				  });
			  }
		  });
	  }
	  
	  