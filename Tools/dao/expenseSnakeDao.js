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


module.exports = {
	querySnake:function(request,response,next){
		var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		var user=request.session.passport.user.user_id;
	 	var _data={};
		pathname+="userExpenseSnake.html";
		request.setEncoding('utf8');
			
			MongoClient.connect(db_url, function(err, db) {
			  // Create a collection we want to drop later
			  var col = db.collection('u_list');
			  // Show that duplicate records got dropped
			  col.find({"user":user}).toArray(function(err, items) {
				 _data.list=items;
				 console.log(_data);
				    get_file(pathname,_data,response);
				db.close();
			  });
			});
	},
	 u_chart:function(request,response,next){
		  var _data={};
		 var user=request.session.passport.user.user_id;
		 var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		pathname+=".html";
			MongoClient.connect(db_url, function(err, db) {
				  // Create a collection we want to drop later
				  var col = db.collection('u_list');
			
				  col.find({"user":user}).toArray(function(err, r) {
					   if (err) {
						 console.log('[query] - :'+err);
							return;
						 }
						  _data.t=[];
						  _data.n=[];
						 for( var x=0;x<r.length;x++  )
						 {
							 _data.t[x]=r[x].expense;
							 _data.n[x]= '"'+r[x].productname+'"';
						 }
						 console.log(_data);

						//Get recommendation list
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
						 // get_file(pathname,_data,response);

					  
					  db.close();
					});

			});

			

	 },
    u_add:function(request,response,next){
		var pathname = url.parse(request.url).pathname;
		var  data=url.parse(request.url, true).query;
		pathname+=".html";
		var _data={
				 _id:0,
				 cid:'',
				 productname:'',
				 expense:'',
				 add_time:'' 
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
				  var col = db.collection('u_list');
				  
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
		var data=url.parse(request.url, true).query;

		console.log(data);

		var formData = request.body;
  		console.log('form data', formData);

		if(data.act)
		 {
			 switch(data.act){				 				
				case "u_add":
		 			var post=request.body;

					console.log('post='+post);

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
						 
						      var col = db.collection('u_list');
							  var _dbDate=[{"user":user,"cid":_data['_id'],"category_name":_data['category_name'],"productname":post.productname,"des":_data['des'],"expense":post.expense,"add_time":post.add_time}];
							  console.log('productname='+_data['productname']); 
							  
							   
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
					else
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
								 console.log(r[0]);
								 _data=r[0];
						 
						      var col = db.collection('u_list');
							  var _dbDate={$set:{"cid":_data['_id'],"category_name":_data['category_name'],"productname":post.productname,"des":_data['des'],"expense":post.expense,"add_time":post.add_time}};
							  var obj_id = new ObjectID(post.id);
							      var whereStr  = { "_id" : obj_id ,"user":user};
							  
							   
							  col.update(whereStr, _dbDate,function(err, result) {
							   if (err) {
								 console.log('[query]u - :'+err);
									return;
								 }
								 
							 show_res(1,'ok',result);
							  // db.close();
							});
						 
							  
							  
							  db.close();
							});
		
						});
						
						
						 
					}
				 
                    break;		
				case "u_del":
						if(data.id != undefined)
						{
							 
							 MongoClient.connect(db_url, function(err, db) {
							  // Create a collection we want to drop later
							  var col = db.collection('u_list');
							  
 						      var obj_id = new ObjectID(data.id);
							  col.remove({"_id":obj_id,"user":user},{safe:true}, function(err, r) {
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