var express = require('express');
var $event = require('../model/eventModel');
var $userEvent = require('../model/userEventModel');
var Mail=require('../dao/Mail');
var $Oauth=require('../model/OauthModel'); 

module.exports = {
	queryEvent:function(req,res,next){
		$event.find({},function (err,result){  //find all events
			if(err){
				res.send('query unsuccessfully');
				console.log(err.messgae);
				return;
			}
			if(result.length==0){ 
				console.log('no event');
				res.render('noEvent');
			}
			else{
				var bookedEvent;
				//find if user has booked events
				$userEvent.find({user:req.session.passport.user.user_id},function(err,data){
					if(err){
						res.send('query unsuccessfully');
						console.log(err.messgae);
						return;
					}
					res.render('userEventManagement',{id:req.session.passport.user.user_id,eventList:result,bookedEvent:data});
					// console.log(data);
				});
				
			}
		})
	},
	
	searchEvent:function(req,res,next){
		var event=req.body.event;
		$event.find({name:{$regex:".*"+event+".*"}},function (err,result){  //find all events
			if(err){
				res.send('search unsuccessfully');
				console.log(err.messgae);
				return;
			}
			res.send(result);
			console.log(result);
			
				
				
			
		})
	},
	
	eventDetail:function(req,res,next){
		$event.find({name:req.query.eventName},function (err,result){
		if(err){
			res.send('query unsuccessfully');
			console.log(err.messgae);
			return;
		 }
		res.render('eventDetail',{
			eventName:result[0].name,
		 	description:result[0].description,
		 	time:result[0].time,
		 	location:result[0].location})
		});
	},
	
	bookEvent:function(req,res,next){
		var newBook=new $userEvent();
		newBook.user=req.body.id;
		newBook.event=req.body.eventName;
		newBook.eventID=req.body.eventID;
		$Oauth.findById(req.body.id,function(err1,result){
			newBook.username=result.username;
		newBook.save(function(err){
			if(err){
				res.send('book unsuccessfully');
				console.log(err.messgae);
				return;
			}
			
			//send mail
			$Oauth.findById(req.body.id,function(er,data){
				if(er){
				console.log(er.messgae);
				return;
				}
			
			console.log('data='+data);
		    Mail.send(data.email,
			'Book Successfully in Wealth Creation',
			'you have booked event:'+req.body.eventName+' successfully', 
			function(error,info){
			 if(error){
				console.log(error.message);
				return;
			  }
			  else{
				console.log('send successfully');
			  }			  
				}
				);	
			
			});
			
			console.log('book successfully');
			res.send('success');
	 	});
		});
	},
	
	cancelBook:function(req,res,next){
		
		var user=req.body.id;
		var eventID=req.body.eventID;
		$userEvent.remove({user:user,eventID:eventID},function (err,result){
			if(err){
				res.send('cancel unsuccessfully');
				console.log(err.messgae);
				return;
			  }
			 res.send("cancel");
		})

	}
}