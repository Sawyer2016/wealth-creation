var express = require('express');
var $event = require('../model/eventModel');
var $userEvent = require('../model/userEventModel');
var Mail=require('../dao/Mail');
var $Oauth=require('../model/OauthModel'); 
var ObjectID = require('mongodb').ObjectID;

module.exports = {
	queryEvent:function(req,res,next){
		$event.find({},function (err,result){  //find all events
			if(err){
				res.render('error',{message:err.message});
				console.log(err.message);
				return;
			}
			res.render('adminEventManagement',{eventList:result});
		});
	},
		
	queryEventByName:function(req,res,next){
		var eventName=req.body.eventName;
		$event.find({name:eventName},function (err,result){
			
			if(result.length>0){
				res.send('exist');
			}
			else{
				res.send('no record');
			}
		});
	},
	createEvent:function(req,res,next){
		var newEvent=new $event();
		newEvent.name = req.body.name;
		newEvent.description = req.body.description;		
		newEvent.time = req.body.time.replace(/T/,' ');
		newEvent.location = req.body.location;
		newEvent.save(function(err){
			if(err){
				res.render('error',{message:err.message});
				console.log(err.message);
				return;
			}
			console.log('create event successfully');
			res.redirect('/tools/adminEvent');
		});
	},
	
	eventDetail:function(req,res,next){

		var owners="";
		
		$userEvent.find({event:req.query.eventName},function (err1,data){
			if(err1){
				res.render('error',{message:err1.message});
				console.log(err1.message);
				return;
			 }
			
			 data.forEach(function(event){
				//owners.push(event.username);
			   owners=owners+event.username+'<br>';
			 
		      });
			  
			 
		$event.find({name:req.query.eventName},function (err,result){
			if(err){
				res.render('error',{message:err.message});
				console.log(err.message);
				return;
			 }
			  console.log('owners='+owners);
			res.render('adminEventDetail',{eventName:result[0].name,description:result[0].description,time:result[0].time,location:result[0].location,owners:owners});
			
		});
			
		});
	},
	sendEmail:function(req,res,next){
		var eventName=req.query.eventName;
		$userEvent.find({event:eventName},function(err,result){
			if(err){
				res.render('error',{message:err.message});
				console.log(err.message);
				return;
			 }
			var userArray=new Array();
			for (var i=0;i<result.length;i++){
						userArray.push(ObjectID(result[i].user));
					}
			console.log(userArray);
			$Oauth.find({_id:{'$in':userArray}},function(er,data){
				if(er){
				res.render('error',{message:er.message});
				console.log(er.message);
				return;
				}
				data.forEach(function(user){
					 Mail.send(user.email,
								'Remider email about your booked event',
								'Your booked event:'+eventName+' is happening!', 
								function(error,info){
								 if(error){
									 res.render('error',{message:error.message});
									console.log(error.message);
									return;
								  }
								  else{
									console.log('send successfully');
								  }			  
									}
									);
				});
			});
		});
	},
	
	deleteEvent:function(req,res,next){
		var eventName=req.query.eventName;
		$event.remove({name:eventName},function (err,result){
			if(err){
				res.render('error',{message:err.message});
				console.log(err.message);
				return;
			 }
			 $userEvent.remove({event:eventName},function (er,result){
				if(err){
					res.render('error',{message:er.message});
					console.log(er.message);
					return;
				 }
				 res.redirect('/tools/adminEvent');
			 });
		});
		
		
	}
}