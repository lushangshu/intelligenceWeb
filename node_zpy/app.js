
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

var mysql = require('mysql-wrapper');
var conn = mysql(
    {
      host     : 'stusql.dcs.shef.ac.uk',
      port     : '3306',
      user     : 'team075',
      password : '62335627',
      database : 'team075'
    }
);

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var jquery = require('jquery');
var request = require('request');
var SparqlClient = require('sparql-client');

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
//store information for question 2a
var tweetKeywords = ["  "];

//store information for question 2b
var twittervenuenameResult2B=[{venue_name:'null',lati:'null',longti:'null'},];
var twitterResult2B = [
  {venue_name:'null',venue_id:'null',lati:'null',longti:'null'},  
];
var addressJson2B=[{lati:'null',longti:'null'},];
var rdfa2B=[
  {venuename:'null' ,venuecategory:'null',venueaddress:'null',venueUrl:'null',venueDescription:'null'},
];
var addressList2B=[];

//store information for question 2c
var venueUsers = [
	{id:0,name:'null',tweetName:'null',location:'null',profile:'null',description:'null'},
];

//store 100 tweets for question 2c part 2
var tweetTimeline = [
	{date:'null',text:'null'},
];

var venueInfo = [
	{id:0,name:'null',lat:0,lng:0,address:'null',city:'null',postalCode:0,photourl:'null'},
];

//DBPedia venue info return
var DBVenueInfo = [
	{subject:'null',label:'null',lat:0 ,lng:0},
]

//database saved venue info
var sqlVenus = [
	{name:'null',abstract:'null',url:'null'},
];

//
app.get('/',function(req,res){
	res.render('index',{
		title:'Query Interface',
		items: twitterResult,
		users: retweetUser,
		venueUsers: venueUsers,
		tweetTimeline:tweetTimeline,
	});

});
app.get('/2a',function(req,res){
	res.render('2a',{
		title:'keywords',
        tweetKeywords: tweetKeywords,
    });

});
app.get('/2b',function(req,res){
  res.render('2b',{
    title:'Query_2b',
    venuesnamesb:twittervenuenameResult2B,
    itemsb: twitterResult2B,
      addressItemsb:addressList2B,
      addressJsonItemb:addressJson2B,
      rfdaItemsb:rdfa2B,
  });

});

app.get('/showMap',function(req,res){
  res.render('showMap',{
    title:'show map nearby',
    venu:sqlVenus,
    venuesnamesb:twittervenuenameResult2B,
    itemsb: twitterResult2B,
      addressItemsb:addressList2B,
      addressJsonItemb:addressJson2B,
      rfdaItemsb:rdfa2B,
  });
});

app.get('/2c',function(req,res){
	res.render('2c',{
		title:'Query Interface',
		items: twitterResult,
		users: retweetUser,
		venueUsers: venueUsers,
		tweetTimeline:tweetTimeline,
		venueInfo:venueInfo,
		DBVenueInfo:DBVenueInfo,
	});

});

// app.get('/venuePhotoQuery',function(req,res){
// 	res.render('/venuePhotoQuery',{
// 		title:'Query Interface',
// 		items: twitterResult,
// 		users: retweetUser,
// 		venueUsers: venueUsers,
// 		tweetTimeline:tweetTimeline,
// 		venueInfo:venueInfo,
// 	});
// });

app.get('/history',function(req,res){
	res.render('history',{
		title:'Query venue search history',
		venu:sqlVenus,
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
  var loc = req.body.geo+","+"200mi";
	var params = {q: pro,c:loc,lang:'en',result_type:'popular',count:'20'};
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

app.get('/venuePhotoQuery',function(req,res){
	res.redirect('/2c');
});

//question 2b
app.post('/2b',function(req,res){
  var user_name = req.body.user_name;
  var days = req.body.days;
  var date=new Date();
  twittervenuenameResult2B=[]
    adressList2B=[];
    //addressJson2B=[]
  rdfa2B=[];
  client.get('search/tweets', {q:'swarmapp.com/c/',from:user_name,since:date.setDate(date.getDates-days),count:10},function(err, data, ress){
                for(var indx in data.statuses){
                          var tweet = data.statuses[indx];
                          var naem=tweet.user.screen_name;
                          for (var indx1 in tweet.entities.urls){
                                twitterText=tweet.entities.urls[indx1].expanded_url
                                stest=twitterText.split('/');
                                console.log(stest);
                                var options = {
                                    url: 'https://api.foursquare.com/v2/checkins/resolve',
                                     method: 'GET',
                                     headers: headers,
                                     qs: {'shortId': stest[stest.length-1], 'oauth_token':accessToken ,'v': '20140806', m: 'swarm'}
                                }
                                request(options,function(error, response, body){
                                      if(!error && response.statusCode == 200) {
                                            var jsonObj = JSON.parse(body); 
                                            var address = jsonObj.response.checkin.venue.location.lat+","+jsonObj.response.checkin.venue.location.lng;    
                                            var lati=jsonObj.response.checkin.venue.location.lat;
                                            var longti=jsonObj.response.checkin.venue.location.lng;
                                            var venue_id = jsonObj.response.checkin.venue.id;
                                            var venue_name = jsonObj.response.checkin.venue.name;
                                            var category=jsonObj.response.checkin.venue.categories[0].name;
                                            var venueUrl=jsonObj.response.checkin.venue.url;
                                            //var description=jsonObj.response.checkin.venue.hereNow.summary;
                                            twittervenuenameResult2B.push({venue_name:venue_name,lati:lati,longti:longti});
                                            addressList2B.push(address);
                                            //rdfa2B.push({venuename:venue_name ,venuecategory:category,venueaddress:address,venueUrl:venueUrl,venueDescription:description});

                                            //'INSERT INTO usersInformation(username,userid,address,description) VALUES(" '+data.statuses[0].user.name+'"," '+data.statuses[0].user.id+'"," '+data.statuses[0].user.location+'"," '+data.statuses[0].user.description+'");
                                      }
                                      else 
                                          console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);               
                                      //res.redirect('/2b');
                                })     
                            }
                       }

                 });
        res.redirect('/2b');
      
  });

//query for 2b point of interest
app.post('/2bshowmap',function(req,res){
  
    twitterResult2B = [];
    var getAddress=req.body.clickbutton;  
// Configure the request
    var options = {
        // localhost does not work if you run from localhost the server itself
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        headers: headers,
        qs: {'ll': getAddress, 'radius': 1000,'intent':'checkin', 'oauth_token': accessToken,
            'v': '20140806', m: 'swarm'}
    }

// Start the request
    request(options,function (error, response, body) {

            if (!error && response.statusCode == 200) {
                // Print out the response body
                 var jsonObj =JSON.parse(body);
                 for(var i=0;i<10;i++){
                
                      var lati= jsonObj.response.venues[i].location.lat;
                
                       var longti=jsonObj.response.venues[i].location.lng;
                       var venue_id=jsonObj.response.venues[i].id;
                addressJson2B.push({lati:lati,longti:longti});
                
                var venuename=jsonObj.response.venues[i].name;
                twitterResult2B.push({venue_name:venuename,venue_id:venue_id,lati:lati,longti:longti});

            }
             console.log(twitterResult2B);

            }
            else {console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);}
            res.redirect('/showMap');
        });
});

//question 2c for venue photo
app.post('/2cQueryVenuePhoto',function(req,res){
	console.log("hello this is 2c query for photo");
});

//question 2c for poi DBPedia
app.post('/2cPOIDBpedia',function(req,res){
	var endpoint = 'http://dbpedia.org/sparql';
	var query = "SELECT ?subject ?label ?lat ?long WHERE{ <http://dbpedia.org/resource/Sheffield> geo:lat ?shefLat. <http://dbpedia.org/resource/Sheffield> geo:long ?shefLong. ?subject geo:lat ?lat. ?subject geo:long ?long. ?subject rdfs:label ?label. FILTER(xsd:double(?lat) - xsd:double(?shefLat) <= 0.1 && xsd:double(?shefLat) - xsd:double(?lat) <= 0.1 && xsd:double(?long) - xsd:double(?shefLong) <= 0.1 && xsd:double(?shefLong) - xsd:double(?long) <= 0.1 && lang(?label) = 'en') .} LIMIT 10";
	
	var client = new SparqlClient(endpoint);
	console.log("Query to " + endpoint);
	console.log("Query: " + query);
	client.query(query)
	  .execute(function(error, results) {
	   console.log(results);
	   var obj = results.results.bindings;
	   for(var i=0;i<results.results.bindings.length;i++){
	   		DBVenueInfo.push({subject:obj[i].subject.value,label:obj[i].label.value,lat:obj[i].lat.value,lng:obj[i].long.value});
	   }
	  res.redirect('/2c');
	});
});

//Search history communicate with MySQL database
app.post('/searchVenueHistory',function(req,res){
  sqlVenus = [{name:"Information common",abstract: "this is abstract",url:"http://upload.wikimedia.org/wikipedia/commons/0/06/Information_commons.jpg"}]
  var queryString = 'SELECT * FROM venueinfo';
  conn.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        for (var i in rows) {
            //console.log(rows[i].venuename+" "+rows[i].venueabstract+" "+rows[i].venueurl);
            sqlVenus.push({name:rows[i].venuename,abstract:rows[i].venueabstract,url:rows[i].venueurl});
        }
        res.redirect('/history');
  });
  //connection.end();
  
});

app.post('/2aQuery',function(req,res){
	var name = ['alex','tom'];
    var wordSum = [];
    var textTotal = "";
    var nameCount = 0;
    var kwNum = 7;
    var day = 5;
    var flagZero=0;

    if((req.body.query)&&name.length<=10)name = (req.body.query).split(",");
//    if(keywords)kwNum=keywords;
    if(req.body.days)day=req.body.days;

    var wordcountTotal = new Array(new Array(),new Array());
    var finalTotal = [];
    //var finalResult = new Array();

//time setting
    var currentDate = new Date();
    var aimDate = new Date();
    aimDate.setDate(currentDate.getDate()-day);
    var year = aimDate.getUTCFullYear().toString();
    var month = (aimDate.getUTCMonth()+1).toString();
    var date = aimDate.getUTCDate().toString();
    var sinceDate = year + '-' + month + '-' + date;


    for(p=0;p<name.length;p++){
//            console.log(p+'a');
            client.get('search/tweets', {from: name[p], since: sinceDate}, callbackCount(p));
    }

    function callbackCount(p){
        return function (err, data, response){

        var postData = "";

                for (var indx in data.statuses) {
                    var tweet = data.statuses[indx];
                    //single tweet
                    postData += (tweet.text+" ");
 //                   console.log(tweet.text)

                }

/* we can set a stoplist to token the tweets at this line for more precise results  */
                postData = postData.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`'"@~()·\|]/g,"");
                postData = postData.replace(/(\r\n|\r|\n|  )/g," ");


                 //total tweet
                textTotal += postData;
                wordData = postData.split(" ");

                //each name's keyword
                //wordcount required init length
                var wordcount = new Array(new Array(),new Array());
                    for(i=0; i<wordData.length;i++){
                           // wordcount[i] = [];
                        for(var n=0; n<wordcount.length;n++){
                            if((n==(wordcount.length-1))&&((wordcount[n][0])!=wordData[i])){
                                wordcount[wordcount.length]=[wordData[i],1];
                           }
                            else if((n!=(wordcount.length-1))&&((wordcount[n][0])==wordData[i]))
                                {wordcount[n][1]++;
                                break;}
                            else
                                continue;
                        }
                    }

//loop counting
                wordSum[nameCount] = wordcount;
                nameCount++;

//endings
            if(wordSum.length==name.length){
                    //total keyword
                    textTotal = textTotal.replace(/(\r\n|\r|\n|  )/g," ");
                    wordTotal = textTotal.split(" ");
                        for(i=0; i<wordTotal.length;i++){
                           // wordcount[i] = [];
                            for(var n=0; n<wordcountTotal.length;n++){
                                if((n==(wordcountTotal.length-1))&&((wordcountTotal[n][0])!=wordTotal[i])){
                                    wordcountTotal[wordcountTotal.length]=[wordTotal[i],1];
                                }
                                else if((n!=(wordcountTotal.length-1))&&((wordcountTotal[n][0])==wordTotal[i]))
                                    {wordcountTotal[n][1]++;
                                    break;
                                }
                                else
                                    continue;
                            }
                        }

//sorting
                    var sortKW = new Array(new Array(),new Array());


                    for(i=0;i<kwNum;i++){

                        sortKW[i]=['',0];
                    }
 //               console.log(wordcountTotal.length);

//results of sorting
                        for(i=0;i<wordcountTotal.length;i++){
                            if ((wordcountTotal[i][1])>(sortKW[kwNum-1][1])){
                                sortKW[kwNum-1] = wordcountTotal[i];

                                    for(n=0;n<kwNum;n++){
                                        for(m=0;m<n;m++){
                                            if ((sortKW[m][1])<(sortKW[n][1])){
                                                var k = sortKW[n];
                                                sortKW[n] = sortKW[m];
                                                sortKW[m] = k;
                                            }
                                            else
                                                continue;
                                        }
                                    }
                            }

                            else
                                continue;

                        }

//                    console.log(sortKW);

                for(i=0;i<name.length;i++){
                    for(m=0;m<sortKW.length;m++){
                        for(n=0;n<wordSum[i].length;n++)
                            if(((wordSum[i])[n][0])==sortKW[m][0]){
                                //console.log(finalTotal[i][0]);
                                finalTotal.push([name[i],(wordSum[i])[n]]);
                                break;
                            }

                            else if((n==wordSum[i].length-1)&&((wordSum[i])[n][0])!=sortKW[m][0])
                                finalTotal.push([name[i],[sortKW[m][0],0]]);

                    }
                }

                for(i=0;i<kwNum;i++){
                    finalTotal.push(['total',sortKW[i]]);
                }

//common to all users
                //console.log(finalTotal);
                for(i=0;i<finalTotal.length;i++){
                    if((finalTotal[i][1][1])==0){
                        var flag = finalTotal[i][1][0];
                        finalTotal.splice(i,1);
                        i--;
                        flagZero++;
                            for(n=0;n<finalTotal.length;n++){
                                if(finalTotal[n][1][0]==flag) {
                                    finalTotal.splice(n, 1);
                                    n--;
                                }
                            }
                    }
                    //console.log(i);
                }

                console.log(flagZero);
                console.log(finalTotal);


                for(k=0;k<kwNum+1;k++) {
                    tweetKeywords[k] = new Array();
                        for(j=0;j<name.length+2;j++){
                            tweetKeywords[k][j]="";
                        }
                }
                console.log(finalTotal.length);
//store in the final array
                for(j=1;j<name.length+2;j++){
                    for(k=1;k<kwNum+1-flagZero;k++){
                        console.log((k-1)+(j-1)*(kwNum-flagZero));
                        tweetKeywords[k][0]=finalTotal[(k-1)+(j-1)*(kwNum-flagZero)][1][0];
                        tweetKeywords[0][j]=finalTotal[(k-1)+(j-1)*(kwNum-flagZero)][0];
                        tweetKeywords[k][j]=finalTotal[(k-1)+(j-1)*(kwNum-flagZero)][1][1];
                    }
                }

                //console.log(wordSum[0]);
                //onsole.log(tweetKeywords);
                //console.log(tweetKeywords[0].length);
                // res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                // res.end(JSON.stringify(tweetKeywords));
                res.redirect('/2a');
            }
        }
    }
   
});

//question 2c 
app.post('/2cQuery',function(req,res){
	var location = req.body.location;
	var d = new Date();
  var curr_date = d.getDate()-req.body.days;
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  var day = curr_year+"-"+curr_month+"-"+curr_date;
	var ful = function1.concatenateNames(location, day);
	venueUsers=[{id:0,name:'null',tweetName:'null',location:'null',profile:'null',description:'null'}];
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
			// below get venues' name, lat and lng
			var venueId = jsonRet.response.venues[indx].id;
			var location_q = jsonRet.response.venues[indx].name;
			var location_lat = jsonRet.response.venues[indx].location.lat;
			var	location_lng = jsonRet.response.venues[indx].location.lng;
			var postalCode = jsonRet.response.venues[indx].location.postalCode;
			var address = jsonRet.response.venues[indx].location.address;
			var city = jsonRet.response.venues[indx].location.city;
			var options_Img = {
				url: 'http://api.foursquare.com/v2/venues/'+venueId+'/photos',
		        method:'GET',
		        headers:headers,
		        qs:{'v':'20131016','oauth_token':accessToken,m:'swarm'}
			};
			var query = location_q +' swarmapp.com/c since:'+day;
      venueInfo.push({id:venueId,name:location_q,lat:location_lat,lng:location_lng,address:address,city:city,postalCode:postalCode,photourl:'null'});
			client.get('search/tweets',{q:query,count:100},function(err,data,respons){
          console.log(data);
					for(var indx in data.statuses){
						venueUsers.push({id:data.statuses[indx].user.id,name:data.statuses[indx].user.name
							,tweetName:data.statuses[indx].user.screen_name,location:data.statuses[indx].user.location
							,profile:data.statuses[indx].user.profile_image_url
							,description:data.statuses[indx].user.description});
            //console.log(venueUsers);
						}
					
				});	
		}
		res.redirect('/2c');
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
		res.redirect('/2c');
	});
	
});



app.listen(3000,function(){
	
});

