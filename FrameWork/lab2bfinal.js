/**
 * Created by fabio on 18/02/15.
 */
var http = require('http');
var querystring = require('querystring');
var protocol = require('http');
var static = require('node-static');
var url = require('url');
var request = require('request');
var file = new (static.Server)();
var portNo = 3001;

var protocol = require('http');
var static = require('node-static');
var url = require('url');
var file = new (static.Server)();
var portNo = 3001;
var mysql = require('mysql');

var connection = mysql.createConnection(
    {
      host     : 'stusql.dcs.shef.ac.uk',
      port     : '3306',
      user     : 'team075',
      password : '62335627',
      database : 'team075'
    }
);


var Twit = require('twit');
var client = new Twit({
    consumer_key:'IDiA4gBjtz3eLyUbmjhKEtu56',
    consumer_secret:'dINaqIHkHdpk7PIbKhVJqeUokRPu5OWYi4KUxl4oyoawuU1GCO',
    access_token: '3066550420-6qGjs7HdExlN7z4VMUzXjQi23qGeoxS4XTzOfqo',
    access_token_secret:'6BP5RcKdy1a5Fos42W9M5pFkixHL5TDTorWdrubGuQVil'
});


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
var accessToken = 'ODE0Z03UDW2YFXJPOWI4TQFSO0D4GHWIJF12IQHMJDTIMJ0U';
// Set the headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

function addslashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}





function addslashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function waitCallBack(param1, callback) {
    console.log('entering...');
    setTimeout(function () {
        if (callback && typeof(callback) === "function") {
            console.log('exiting...');
            callback();
        }
    }, param1);
}


function getPlaceCheckin(username,days,oAuthTkn){
    //var date = '2015-04-01';
    var twitterText
    var stest
    var date=new Date()
    client.get('search/tweets', { q:'swarmapp.com/c/',from:username,since:date.setDate(date.getDates-7)},function (err, data, response) {
        console.log(data.statuses[0].user.id)
        console.log(data.statuses[0].user.name)
        console.log(data.statuses[0].user.location)
        console.log(data.statuses[0].user.description)
        console.log("!!!!!!!!!@$#$@#%@#$%#$^%&^%*%^&^#$")


        for(var indx in data.statuses) {
            var tweet = data.statuses[indx];
            var naem=tweet.user.screen_name
            //console.log(tweet.user)
           // var twitterContact
            for (var indx1 in tweet.entities.urls){
                  twitterText=tweet.entities.urls[indx1].expanded_url
                  stest=twitterText.split('/')
                  
                  var options = {
                  // localhost does not work if you run from localhost the server itself
                  url: 'https://api.foursquare.com/v2/checkins/resolve',
                  method: 'GET',
                  headers: headers,
                  qs: {'shortId': stest[stest.length-1], 'oauth_token':oAuthTkn ,'v': '20140806', m: 'swarm'}
                  }
      
        
                  request(options,function (error, response, body) {
              
                      if(!error && response.statusCode == 200) {
                              var jsonObj =JSON.parse(body)
                              
                              
                              console.log(jsonObj.response.checkin.venue.name)
                        }
                       else 
                            console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);
                                        
                       })
      
                }
          
        } 
            var query=connection.query('SELECT * FROM mytable');
            var insert= 'INSERT INTO mytable(username,userid,address,description) VALUES(" '+data.statuses[0].user.name+'"," '+data.statuses[0].user.id+'"," '+data.statuses[0].user.location+'"," '+data.statuses[0].user.description+'")';
                   
            connection.query(insert);
            query.on('error', function(err) {
                    throw err;
            });
            query.on('fields', function(fields) {
                    console.log(fields);
            });
            query.on('result', function(row) {
                    console.log(row);
            });
            connection.end();

    });
}
getPlaceCheckin('nepenthes9','7',accessToken)




//create table locationvisited(id int unsigned not null auto_increment primary key,venueId VARCHAR(20),userid int(11),venueName VARCHAR(mysql> create table locationvisited(id int unsigned not null auto_increment primary key,venueId VARCHAR(20),userid int(11),venueName VARCHAR(30));

//create table locationvisited(id int unsigned not null auto_increment primary key,username VARCHAR(20),userid int(11),address VARCHAR(mysql> create table locationvisited(id int unsigned not null auto_increment primary key,venueId VARCHAR(20),userid int(11),venueName VARCHAR(30))















