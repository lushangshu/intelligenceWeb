
/**
 * All rights reserved by Shangshu Lu
 */

var Twitter = require('twit');
var client = new Twitter({
    consumer_key:'IDiA4gBjtz3eLyUbmjhKEtu56',
    consumer_secret:'dINaqIHkHdpk7PIbKhVJqeUokRPu5OWYi4KUxl4oyoawuU1GCO',
    access_token: '3066550420-6qGjs7HdExlN7z4VMUzXjQi23qGeoxS4XTzOfqo',
    access_token_secret:'6BP5RcKdy1a5Fos42W9M5pFkixHL5TDTorWdrubGuQVil'
});
//foursquare user information --- tokens and secret keys
var config = {
    'secrets': {
        'clientId': 'Y5QTM3QVZ1IU3I0YECGY4CMTSLUG3YZDPPDWZ2TSMHYUXMKS',
        'clientSecret': '4LCX3C1JVLMHP3JBF21GS3W2NS3QZQH1PEWBZZJHS2TMTVV5',
        'redirectUrl': 'http://www.localhost.com/URI'
    },
    'foursquare': {
        'mode': 'swarm'
    }
}
var accessToken = 'ODE0Z03UDW2YFXJPOWI4TQFSO0D4GHWIJF12IQHMJDTIMJ0U' ;
//https://api.foursquare.com/v2/checkins/resolve?shortId=fcP5m3yn7AL&oauth_token=
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var jquery = require('jquery');
var request = require('request');

//import funcitons
var function1= require('./1');
var bodyParser = require('body-parser');
var app = express();
var Promise = require('express-promise');
// all environments
app.set('port', process.env.PORT || 3000);
//configure app
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(bodyParser.json());
//app.use(require('express-promise')());
app.use(Promise());
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//store information for question 1 part 1
var twitterResult = [
	{id:1,date:'0',author:'null',content:'null'},	
];

//store informaiton for question 1 part 2
var retweetUser = [
	{id:0,name:'null',profile:'null'},
];

//store information for question 2c
var venueUsers = [
	{id:0,name:'null',tweetName:'null',location:'null',profile:'null',description:'null'},
];

//store 100 tweets for question 2c part 2
var tweetTimeline = [
	{date:'null',text:'null'},
];

app.get('/',function(req,res){
	res.render('index',{
		title:'Query Interface',
		items: twitterResult,
		users: retweetUser,
		venueUsers: venueUsers,
		tweetTimeline:tweetTimeline,
	});
});

app.get('/Retweets/:id',function(req,res){
	//console.log(req.param("id"));
	var id_str = req.param("id");
	console.log(id_str);
	var param = {id:id_str,count:10};
	//var param = {id:'600476805846343681',count:10};
	retweetUser = [];
	client.get('statuses/retweets',param,function(err,data,ress){
		//console.log(data);
		var result = data;
		for(i=0;i<result.length;i++){
			console.log(result[i].id);
			retweetUser.push({id:result[i].id,name:result[i].user.name,profile:result[i].user.profile_image_url});
		}
		res.redirect('/');
	});
	
});

app.post('/1',function(req,res){
	var pro = req.body.promise;
	console.log(pro);
	var params = {q: pro,c: '53.38,-1.46,200mi',count:'20'};
	twitterResult = [];
	client.get('search/tweets',params,function(err,data,ress){
		//console.log(data);
		for (var indx in data.statuses) {
           	var tweet = data.statuses[indx];
            var message = ' -  Date: '+tweet.created_at+' from:  '+tweet.user.screen_name+' ：'+tweet.text;
            //console.log(message);
            twitterResult.push({id:tweet.id_str,date:tweet.created_at,author:tweet.user.screen_name,content:tweet.text});
          }
     res.redirect('/');
	});
});


//question 2c 
app.post('/2c',function(req,res){
	var location = req.body.location;
	var days = req.body.days;
	var ful = function1.concatenateNames(location, days);
	venueUsers=[];
	var options= {
		url: 'http://api.foursquare.com/v2/venues/search/',
        method:'GET',
        headers:headers,
        qs:{'v':'20131016','ll':'53.38,-1.46','query':location,'oauth_token':accessToken,m:'swarm'}
	};

	request(options,function(error,response,body){
		var jsonRet = JSON.parse(body);
		//console.log(body);
		for(var indx=0;indx<jsonRet.response.venues.length;indx++){
			var location_q = jsonRet.response.venues[indx].name;
			var query = location_q +' swarmapp.com/c';
			client.get('search/tweets',{q:query,count:100},function(err,data,respons){
				for(var indx in data.statuses){
					venueUsers.push({id:data.statuses[indx].user.id,name:data.statuses[indx].user.name
						,tweetName:data.statuses[indx].user.screen_name,location:data.statuses[indx].user.location
						,profile:data.statuses[indx].user.profile_image_url
						,description:data.statuses[indx].user.description});
				}
			});
		}
		res.redirect('/');
	});
});

app.get('/timeline/:sn',function(req,res){
	//console.log(req.param("id"));
	var screenName = req.param("sn");
	var param = {count:100,screen_name:screenName};
	tweetTimeline = [];
	client.get('statuses/user_timeline',param,function(err,data,ress){
		var result = data;
		for(i=0;i<result.length;i++){
			//console.log(result[i].text);
			tweetTimeline.push({date:result[i].created_at,text:result[i].text});
		}
		res.redirect('/');
	});
	
});



app.listen(3000,function(){
	
});

