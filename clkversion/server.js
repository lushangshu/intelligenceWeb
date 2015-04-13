/**
 * Created by Shangshu Lu, Likang Cao, Pengyuan Zhao
 */

//twitter user information --- tokens and secret keys
var protocol = require('http');
var static = require('node-static');
var url = require('url');
var request = require('request');
var file = new (static.Server)();
var portNo = 3001;
var Twit = require('twit');
var client = new Twit({
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
// Set the headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

//Mysql config information
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

//
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

//数据库部分代码 ---->

//建立数据库连接 这部分代码是实验课上的示例代码
function setUpAndConnectMySQL()
{
    connection.connect();
    var query = connection.query('SELECT * FROM shili');
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
}

//表示
function searchHistory()
{

}

function sendSearchHistoryToHtml(data)
{

}
//

var app = protocol.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var body = '';

    //第一题的twitter ---->
    if ((req.method == 'POST') && (pathname == '/postFile.html')){
        var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            body= JSON.parse(body);
            var topic= body.topic;
            var coordinates = body.coordinates+',20mi';
            var coordinates = body.coordinates;
            client.get('search/tweets', { q:topic,geocode:coordinates,count:100},function (err, data, response) {           
                 res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                 res.end(JSON.stringify(data));
                 console.log(data);
                 
            });
        });
    }

    //第二题的a ---->
    else  if ((req.method == 'POST') && (pathname == '/postFile1.html')){
        var pathname = url.parse(req.url).pathname;
        var body = '';
        var dataFin = {ok: 'ok'};
       var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            body= JSON.parse(body);
            var query = body.sName;
            var days = body.hDays;
            var keywords = body.hKeywords;

            clkTest(query, keywords, days);
        });
    }
        //第二题的b ---->
    else if ((req.method == 'POST') && (pathname == '/postFile2.html')){
       
       var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var result = JSON.parse(body);
            console.log('*****start');
            ZPYgetPlaceCheckin(result.userid,result.days,accessToken);
        });
    }

    //第二题的c ---->
     
    else if ((req.method == 'POST') && (pathname == '/postFile3.html')){
        console.log('start');
        var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var result = JSON.parse(body);
            //LSSgetVenueCoordinates(result.c_location,result.c_days,accessToken,LSSgetUserList);
            var location = result.c_location;
            //console.log(location);
            var options = {
                url: 'http://api.foursquare.com/v2/venues/search/',
                method:'GET',
                headers:headers,
                qs:{'v':'20131016','ll':'53.38,-1.46','query':location,'oauth_token':accessToken,m:'swarm'}
                }

            var venLat,venLng,location_q;
            request(options,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var nameArray = [];
                    var idArray = [];
                    var imgUrl = [];
                    var jsonRet = JSON.parse(body);
                    for(var indx=0; indx<jsonRet.response.venues.length;indx++){
                        location_q = jsonRet.response.venues[indx].name;
                        //console.log('**'+location_q);
                        var query = location_q + ' swarmapp.com/c';
                        client.get('search/tweets', { q: query,count:100},function (err, data, response) { 
                        //console.log(query);
                        var data_1 = JSON.stringify(data);
                        for(var indx in data.statuses){
                            nameArray.push(data.statuses[indx].user.name);
                            idArray.push(data.statuses[indx].user.id);
                            imgUrl.push(data.statuses[indx].user.profile_image_url);
                            //console.log(data.statuses[indx].user.name)
                        }
                        if((indx+1)>jsonRet.response.venues.length)
                        {
                            console.log(nameArray+indx+'***');
                            res.writeHead(200, { "Content-Type": "application/text", 'Access-Control-Allow-Origin': '*'});
                            res.end(JSON.stringify(nameArray));
                        }
                    }); 
                    }
                    
                    // location_q = jsonRet.response.venues[0].name;
                    // venLat = jsonRet.response.venues[0].location.lat;
                    // venLng = jsonRet.response.venues[0].location.lng;
                    //console.log('**Lat:' + venLat + '**Lng: '+venLng);
                    //var query = location_q + ' swarmapp.com/c';
                    //var coordinates = venLat+','+venLng+','+'0.3mi';          
        }
        else
             console.log('error: '+response.statusCode + 'response: '+JSON.parse(response.body).meta.errorDetail);
        //callback(locationQuery,venLat,venLng,days);
        
        });    
    });
       
    }
  
    else{
        file.serve(req, res, function (err, result) {
                    if (err != null) {
                        console.error('Error serving %s - %s', req.url, err.message);
                        if (err.status === 404 || err.status === 500) {
                            file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
                        } else {
                            res.writeHead(err.status, err.headers);
                            res.end();
                        }
                    } else {
                        res.writeHead(200, {"Content-Type": "text/plain", 'Access-Control-Allow-Origin': '*'});

                    }
                });
    }
}).listen(portNo);
        
//other functions----Pengyuan Zhao
function PYZgetVenuseByUserId(userid,days,oauth_token)
{
    var options={
        url:'http://api.foursquare.com/v2/users/'+userid+'/venuelikes',
        method:'GET',
        headers:headers,
        qs:{'USER_ID':userid,'afterTimestamp':days*24*60*60,'oauth_token':oauth_token,'v':'20140806',m:'swarm'}
    }

    request(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var jsonObj = JSON.parse(body)
            var itemaccount = jsonObj.response.venues.count;
            for(var indx in jsonObj.response.venues.items)
            {
                var item = jsonObj.response.venues.items[indx];
                console.log(item.name);
            }
        }
        else
            console.log('error: '+response.statusCode + 'response: '+JSON.parse(response.body).meta.errorDetail);
    });
}

function ZPYgetPlaceCheckin(username,days,oAuthTkn){
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
            // var query=connection.query('SELECT * FROM mytable');
            // var insert= 'INSERT INTO mytable(username,userid,address,description) VALUES(" '+data.statuses[0].user.name+'"," '+data.statuses[0].user.id+'"," '+data.statuses[0].user.location+'"," '+data.statuses[0].user.description+'")';
                   
            // connection.query(insert);
            // query.on('error', function(err) {
            //         throw err;
            // });
            // query.on('fields', function(fields) {
            //         console.log(fields);
            // });
            // query.on('result', function(row) {
            //         console.log(row);
            // });
            // connection.end();

    });
}

//other functions----Shangshu Lu
function LSSgetVenueCoordinates(locationQuery,days,oauth_token,callback)
{
    var options = {
        url: 'http://api.foursquare.com/v2/venues/search/',
        method:'GET',
        headers:headers,
        qs:{'v':'20131016','ll':'53.38,-1.46','query':locationQuery,'oauth_token':oauth_token,m:'swarm'}
    }
    var venLat,venLng;
    request(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var jsonRet = JSON.parse(body);
            venLat = jsonRet.response.venues[0].location.lat;
            venLng = jsonRet.response.venues[0].location.lng;
            console.log('**Lat:' + venLat + '**Lng: '+venLng);
            console.log('1. start callback function');
            callback(locationQuery,venLat,venLng,days);
            console.log('location Query callback before ' + locationQuery);
            
        }
        else
             console.log('error: '+response.statusCode + 'response: '+JSON.parse(response.body).meta.errorDetail);
        //callback(locationQuery,venLat,venLng,days);
        
    });
}

function LSSgetUserList(venueName,lat,lng,days)
{
    console.log('2. callback function started');

    var query = venueName + ' swarmapp.com/c';
    var coordinates = lat+','+lng+','+'20mi';
    console.log('3. coordinates is :'+coordinates);
    var date = '2015-01-01';
    client.get('search/tweets', { q: query,geocode:coordinates,count:10},function (err, data, response) { 
        //console.log('query == '+ query);
        var data_1 = JSON.stringify(data);
        //console.log('4. twitter request' + data_1);
        var nameArray = [];
        for(var indx in data.statuses){
            //console.log('5. username ****'+data.statuses[indx].user.name);
            nameArray.push(data.statuses[indx].user.name);
            
        }
        result_2_C = nameArray;
        console.log(result_2_C);
    // client.get('search/tweets', { q: query,geocode:'53.38,-1.46,20mi',count:100},function (err, data, response) { 
    //     //console.log('query == '+ query);
    //     var data_1 = JSON.stringify(data);
    //     console.log('4. twitter request' + data_1);
    //     var nameArray = new Array(100);
    //     var idArray = new Array(100);
    //     for(var indx in data.statuses){
    //         console.log('5. username  '+data.statuses[indx].user.name);
    //         nameArray.push(data.statuses[indx].user.name);
    //         idArray.push(data.statuses[indx].id);
    //         // res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
    //         // res.end(JSON.stringify(locationQuery));
    //         // console.log('push back data _________________');
    //     }
        
        //console.log('on: ' + tweet.created_at);
        //console.log('@' + addslashes(tweet.user.screen_name));
        //console.log(addslashes(tweet.text));
        //res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
        //res.end(JSON.stringify(data));
        //console.log('6. tweeter log out finished');
});
}

function LSSUseUserIDGetInformation(id)
{
    var date = '2015-01-01';
    client.get('users/lookup', {userid:id},function (err, data, response) { 
            console.log(data.profile_image_url);
        }
);
}
function LSSuseAjaxReturnResult2_c()
{

}

//fix the days to the standard format for twitter API
function LSSHandleDays(days)
{
    var date = days;
    return date;
}

//other functions----Likang Cao
function clkTest(query, keywords, days){
    var name = ['alex','tom'];
    var wordSum = [];
    var textTotal = "";
    var nameCount = 0;
    var kwNum = 2;
    var day = 5;
    if(query&&name.length<=10)name = query.split(",");
    if(keywords)kwNum=keywords;
    if(days)day=days;

    var wordcountTotal = new Array(new Array(),new Array());
    var finalTotal = [];

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
 //                   console.log(tweet.text);

                    res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                    res.end(JSON.stringify(data));

                 }

/* we can set a stoplist to token the tweets at this line for more precise results  */
                postData = postData.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`'"@~()·\|]/g,"");
                postData = postData.replace(/(\r\n|\r|\n|  )/g," ");


                 //total tweet
                textTotal += postData;
                wordData = postData.split(" ");
//               console.log(JSON.stringify(textTotal));
//                console.log(textTotal);

                //each name's keyword
                //wordcount required init length
                var wordcount = new Array(new Array(),new Array());
                    for(i=0; i<wordData.length;i++){
                           // wordcount[i] = [];
                        for(var n=0; n<wordcount.length;n++){
                           // console.log(n);
                           // console.log(wordcount[0][0]);
                            if((n==(wordcount.length-1))&&((wordcount[n][0])!=wordData[i])){
                            //console.log(n);
                                wordcount[wordcount.length]=[wordData[i],1];
                               // console.log(wordcount[n]);
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
                                    //总的keyword
                    textTotal = textTotal.replace(/(\r\n|\r|\n|  )/g," ");
                    wordTotal = textTotal.split(" ");
                        for(i=0; i<wordTotal.length;i++){
                           // wordcount[i] = [];
                            for(var n=0; n<wordcountTotal.length;n++){
                           // console.log(n);
                           // console.log(wordcount[0][0]);
                                if((n==(wordcountTotal.length-1))&&((wordcountTotal[n][0])!=wordTotal[i])){
                            //console.log(n);
                                    wordcountTotal[wordcountTotal.length]=[wordTotal[i],1];
                               // console.log(wordcount[n]);
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
                }

                console.log(finalTotal); 
            }
        }
    }     
}

function CLKanyFunction_2()
{

}




