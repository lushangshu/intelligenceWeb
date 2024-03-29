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
      user     : 'acp14sl',
      password : 'a10b822e',
      database : 'acp14sl'
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
            var query= body.query;
            client.get('search/tweets', { q:query,count:2},function (err, data, response) {
                
                for (var indx in data.statuses) {
                    var tweet = data.statuses[indx];
                    console.log('on: ' + tweet.created_at);
                    console.log('@' + addslashes(tweet.user.screen_name));
                    console.log(addslashes(tweet.text));
                    res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                    res.end(JSON.stringify(data));
                 }
            });
        });
    }

    //第二题的a ---->
    else  if ((req.method == 'POST') && (pathname == '/postFile1.html')){
        var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            body= JSON.parse(body);
            var query= body.query;
            client.get('search/tweets', { q:query,count:2},function (err, data, response) {
                
                for (var indx in data.statuses) {
                    var tweet = data.statuses[indx];
                    console.log('on: ' + tweet.created_at);
                    console.log('@' + addslashes(tweet.user.screen_name));
                    console.log(addslashes(tweet.text));
                    res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                    res.end(JSON.stringify(data));
                 }
            });
        });
    }
        //第二题的b ---->
    else if ((req.method == 'POST') && (pathname == '/postFile2.html')){
       
       var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
           PYZgetVenuseByUserId(body.user_id,body.days,accessToken);
        });
    }

    //第二题的c ---->
     
    else if ((req.method == 'POST') && (pathname == '/postFile3.html')){
        var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            body= JSON.parse(body);
            var query= body.query;
        
            res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
            res.end(JSON.stringify(data));
                 }
            );
       
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

//other functions----Shangshu Lu

function LSSgetUserList()
{

}

//other functions----Likang Cao
function CLKanyFunction_1()
{

}

function CLKanyFunction_2()
{

}




