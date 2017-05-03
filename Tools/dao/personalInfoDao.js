var express = require('express');
var $personalInfo = require('../model/personalInfoModel');
var ObjectId = require('mongoose').Types.ObjectId;
var $Oauth=require('../model/OauthModel'); 
module.exports = {
	add:function(req,res,next){
		var param = req.body;
		$personalInfo.find({_id:ObjectId(req.session.passport.user.user_id)},function (err,result){
			if(err){
				res.send('something wrong');
				console.log(err.messgae);
				return;
			 }
			 if(result.length==0){
				 var newPerson=new $personalInfo();
				 newPerson._id=req.session.passport.user.user_id;
				 newPerson.age=param.age;
				 newPerson.address=param.address;
				 newPerson.phone=param.phone;
				 newPerson.income=param.income;
				 newPerson.occupation=param.occupation;
				 newPerson.interests=param.interests;
			     newPerson.save(function(err){
					if(err){
						res.send('add unsuccessfully');
						console.log(err.messgae);
						return;
					}
					console.log('add successfully');
				 })
			 }
			 else{
				var updateInfo={$set:{age:param.age,address:param.address,phone:param.phone,income:param.income,occupation:param.occupation,interests:param.interests}};
				$personalInfo.update({_id:ObjectId(req.session.passport.user.user_id)},updateInfo,function(err,result){
					if(err){
						res.send('update unsuccessfully');
						console.log(err.messgae);
						return;
					}
					console.log('update successfully');
				})
				 
			 }
			 res.render('index');
		});
	},
	
	queryByName: function (req, res, next) {
	    var name;
		$Oauth.find({_id:ObjectId(req.session.passport.user.user_id)},function(err1,data){
			if(err1){
				res.send('query unsuccessfully');
				console.log(err1.messgae);
				return;
			}
			name=data[0].name;
			console.log('name='+name);
		$personalInfo.find({_id:ObjectId(req.session.passport.user.user_id)},function (err,result){
			if(err){
				res.send('query unsuccessfully');
				console.log(err.messgae);
				return;
			}
			console.log('name='+name);
			if(result.length>0){
				console.log('have record');
				res.render('personalInfo', { 
				    name:name,
					age: result[0].age,
					address:result[0].address,
					phone:result[0].phone,	
					income:result[0].income,
					occupation:result[0].occupation,
					interests:result[0].interests
				});
			}
			else{
				console.log('no record');
				res.render('personalInfo',{
					name:name,
					age: '' ,
					address:'' ,
					phone:'' ,
					income:'' ,
					occupation:'' ,
					interests:''
				});
			}
		});
		});
	}
	
}
