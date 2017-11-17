var express = require('express');
var $income = require('../model/sourceOfIncomeModel');
var $usedIncome = require('../model/usedIncomeOfSourceModel');
var $oauth= require('../model/OauthModel');
var pageSize=5;
module.exports = {
	querySource:function(req,res,next){     
		var numberOfSource;
		var totalPageNumber;
		var pageNumber;
		if(typeof(req.query.page)=='undefined'){
			pageNumber=1;
		}
		else{
			pageNumber=req.query.page;
		}
		$income.find({owner:'public'},function (err,result){
			if(err){
				res.render('error',{message:err.message});
				console.log(err.messgae);
				return;
			}
			numberOfSource=result.length;
		
			$income.find({owner:'public'}).sort({'_id':1}).skip((pageNumber-1)*pageSize).limit(pageSize).exec(function(err2,perPage){
				if(numberOfSource%pageSize==0){
					totalPageNumber=numberOfSource/pageSize;
				}
				else{
					totalPageNumber=(numberOfSource-numberOfSource%pageSize)/pageSize+1;
					console.log(totalPageNumber);
				}
				res.render('adminSourceOfIncome',{
					totalPageNumber:totalPageNumber,
					SourceList:perPage,
					pageNumber:pageNumber
				});  
			});
		});	
	},
	incomeSourceDetail:function(req,res,next){
		$income.find({name:req.query.sourceName},function (err,result){
			if(err){
				res.render('error',{message:err.message});
				console.log(err.messgae);
				return;
			}
			res.render('adminIncomeSourceDetail',{
				Name:req.query.sourceName,
				Introduction:result[0].introduction,
				Description:result[0].description
			});
		});
	},
	
	querySourceByName:function(req,res,next){
		var source=req.body.source;
		$income.find({name:source},function (err,result){
			console.log(result.length);
			if(result.length>0){
				res.send('exist');
			}
			else{
				res.send('no record');
			}
		});
	},
	createSource:function(req,res,next){
	var newPublicSource=new $income();
	newPublicSource.name=req.body.name;
	newPublicSource.introduction=req.body.introduction;
	newPublicSource.description=req.body.description;
	newPublicSource.owner='public';
	newPublicSource.save(function(err){
		if(err){
					res.render('error',{message:err.message});
					console.log(err.messgae);
					return;
				}
	});
	$oauth.find({},function(err,result){
		result.forEach(function(user){
			var newSource=new $income();
			newSource.name=req.body.name;
			newSource.introduction=req.body.introduction;
			newSource.description=req.body.description;
			newSource.owner= user._id;	
			newSource.star='0';
			newSource.save(function(err1){
				if(err1){
					res.render('error',{message:err1.message});
					console.log(err.messgae);
					return;
				}
			})
			});
		res.redirect('/tools/adminIncome');
	
		});
	},
	deleteSource:function(req,res,next){
		var sourceName=req.query.sourceName;
		$income.remove({name:sourceName},function (err,result){
			if(err){
				res.render('error',{message:err.message});
				console.log(err.messgae);
				return;
			}
			$usedIncome.remove({sourceName:sourceName},function (er,result){
				if(er){
				res.render('error',{message:er.message});
				console.log(er.messgae);
				return;
			}
			res.redirect('/tools/adminIncome');
			})
		});
	}
}