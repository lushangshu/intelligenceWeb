
/**
 * Module dependencies.
 */

var Twitter = require('twit');
var client = new Twitter({
    consumer_key:'IDiA4gBjtz3eLyUbmjhKEtu56',
    consumer_secret:'dINaqIHkHdpk7PIbKhVJqeUokRPu5OWYi4KUxl4oyoawuU1GCO',
    access_token: '3066550420-6qGjs7HdExlN7z4VMUzXjQi23qGeoxS4XTzOfqo',
    access_token_secret:'6BP5RcKdy1a5Fos42W9M5pFkixHL5TDTorWdrubGuQVil'
});

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var jquery = require('jquery');

//import funcitons
var function1= require('./1');
var bodyParser = require('body-parser');
var app = express();
var Promise = require('express-promise');
//var jsonParser = bodyParser.json();

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

var todoItems = [
	{id:1,desc:'result1'},
	{id:2,desc:'result2'}
];
var twitterResult = [
	{id:1,date:'0',author:'null',content:'null'},	
];

app.get('/',function(req,res){
	res.render('index',{
		title:'Query Interface',
		items: twitterResult
	});
});

app.post('/1',function(req,res){
	var pro = req.body.promise;
	console.log(pro);
	var params = {q: pro,c: '53.38,-1.46,20mi',count:'6'};
	twitterResult = [];
	client.get('search/tweets',params,function(err,data,ress){
		for (var indx in data.statuses) {
           	var tweet = data.statuses[indx];
            var message = ' -  Date: '+tweet.created_at+' from:  '+tweet.user.screen_name+' ：'+tweet.text;
            console.log(message);
            twitterResult.push({id:twitterResult.length+1,date:tweet.created_at,author:tweet.user.screen_name,content:tweet.text});
          }
     res.redirect('/');
	});
});

app.post('/2c',function(req,res){
	var result = req.body.topic;
	var result2 = req.body.coordinates;
	var ful = function1.concatenateNames(result, result2);
	var params = {q: 'sufc',c: '53.38,-1.46,20mi',count:'2'};
	client.get('search/tweets', params, function(err, data, ress){
		var resu = JSON.parse(data);
		console.log(resu);
		res.redirect('/');
      });
});


app.listen(3000,function(){
	
});

