var express = require('express');
var $income = require('../model/sourceOfIncomeModel');
var $usedSource = require('../model/usedIncomeOfSourceModel');
var pageSize=5;

module.exports = {
	querySource:function(req,res,next){     
		var numberOfSource;
		var totalPageNumber;
		var pageNumber;
		var user=req.session.passport.user.user_id;
		if(typeof(req.query.page)=='undefined'){
			pageNumber=1;
		}
		else{
			pageNumber=req.query.page;
		}
		$income.find({owner:user},function(err,result){
			if(err){
					res.send('query unsuccessfully');
					console.log(err.messgae);
					return;
				}			
			console.log('total:'+result.length);
				$usedSource.find({user:user},function (err1,data){ //find used sources
					var sourceArray=new Array();
					for (var i=0;i<data.length;i++){
						sourceArray.push(data[i].sourceName);
					}
					numberOfSource=result.length-data.length;			
					$income.find({name:{'$nin':sourceArray},owner:user}).sort({'star':-1}).skip((pageNumber-1)*pageSize).limit(pageSize).exec(function(err2,perPage){
						if(numberOfSource%pageSize==0){
							totalPageNumber=numberOfSource/pageSize;
						}
						else{
							totalPageNumber=(numberOfSource-numberOfSource%pageSize)/pageSize+1;
							
						}
						console.log(totalPageNumber);
						res.render('userSourceOfIncome',{
							totalPageNumber:totalPageNumber,
							SourceList:perPage,
							pageNumber:pageNumber
						});  
					});
				});
		});
			
			
		
	},
	incomeSourceDetail:function(req,res,next){
		$income.find({name:req.query.sourceName},function (err,result){
			if(err){
				res.send('query unsuccessfully');
				console.log(err.messgae);
				return;
			}
		 	res.render('incomeSourceDetail',{
		 		Name:req.query.sourceName,
		 		Introduction:result[0].introduction,
		 		Description:result[0].description
		 	});
	 	});
	},
	usedSource:function(req,res,next){     //mark as used
		var usedSource=new $usedSource();
		usedSource.user=req.session.passport.user.user_id;
		usedSource.sourceName=req.query.sourceName;
		usedSource.save(function(err){
			if(err){
				res.send('mark unsuccessfully');
				console.log(err.messgae);
				return;
			}
			console.log('mark successfully');
			res.redirect('/tools/userIncome');
			
	 	});
	},
	rateSource:function(req,res,next){
		console.log(req.query.name+'  '+req.query.star);
		$income.update({name:req.query.name,owner:req.session.passport.user.user_id},{$set:{star:req.query.star}},function(err){
			if(err){
				res.render('error');
				return;
			}
			res.redirect('/tools/userIncome');
		});
	},
	
	usedSourceList:function(req,res,next){
		$usedSource.find({user:req.session.passport.user.user_id},function (err,result){
			if(err){				
				console.log(err.messgae);
				return;
			}
			var sourceArray=new Array();
				for (var i=0;i<result.length;i++){
					sourceArray.push(result[i].sourceName);
				}
				console.log(sourceArray);
			$income.find({name:{'$in':sourceArray}},function (err,data){
				res.render('usedSourceList',{usedSourceList:data});
			});
			
			});
	},
	createSource:function(req,res,next){   //create source
		var newSource=new $income();
		newSource.name=req.body.name;
		newSource.introduction=req.body.introduction;
		newSource.description=req.body.description;
		newSource.owner=req.session.passport.user.user_id;
		newSource.star='0';
		newSource.save(function(err){
			if(err){
				res.send('book unsuccessfully');
				console.log(err.messgae);
				return;
			}
			console.log('book successfully');					
			res.redirect('/tools/userIncome');
		});
	}
}