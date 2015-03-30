/**
 * Created by fabio on 18/02/15.
 */
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

// Set the headers

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

var app = protocol.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var body = '';
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
                    //console.log('on: ' + tweet.created_at);
                    //console.log('@' + addslashes(tweet.user.screen_name));
                    console.log(addslashes(tweet.text));
                    
                    res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                    //console.log('body: ' + data);

                    //res.end(JSON.stringify(data));
                    console.log("111111111111111");
                 }
            });
        });
    }
    else  if ((req.method == 'POST') && (pathname == '/postFile1.html')){
        var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        
    
        req.on('end', function () {
            body= JSON.parse(body);
            var query= body.query;
            
            client.get('search/tweets', { q:query,geocode:'51.5085300,-0.1257400,200mi'},function (err, data, response) {
                
                for (var indx in data.statuses) {
                    var tweet = data.statuses[indx];
                    //console.log('on: ' + tweet.created_at);
                    //console.log('@' + addslashes(tweet.user.screen_name));
                    console.log(addslashes(tweet.text));
                    
                    res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                    //console.log('body: ' + data);

                    //res.end(JSON.stringify(data));
                    console.log("2222222222");
                 }
            });
        });
    }
     
        else if ((req.method == 'POST') && (pathname == '/postFile2.html')){
        var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        
    
        req.on('end', function () {
            body= JSON.parse(body);
            var query= body.query;
            
            client.get('search/tweets', { q:query,count:3},function (err, data, response) {
                
                for (var indx in data.statuses) {
                    var tweet = data.statuses[indx];
                    //console.log('on: ' + tweet.created_at);
                    //console.log('@' + addslashes(tweet.user.screen_name));
                    console.log(addslashes(tweet.text));
                    
                    res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                    //console.log('body: ' + data);

                    //res.end(JSON.stringify(data));
                    console.log("33333333323333333");
                 }
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
        



