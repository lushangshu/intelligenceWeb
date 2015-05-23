/**
 * Created by fabio on 18/02/15.
 */
var protocol = require('http');
var static = require('node-static');
var util = require('util');
var url = require('url');
var querystring = require('querystring');

var express = require('express');
var app_e = express();
app_e.get('/',function(req,res){
    res.send('adfasdf');
});
app_e.listen(3000);

var file = new (static.Server)();
var portNo = 3001;

var app = protocol.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if ((req.method == 'POST') && (pathname == '/postFile.html')) {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                res.writeHead(413,
                    {'Content-Type': 'text/plain'}).end();
                req.connection.destroy();
            }

        });
        req.on('end', function () {
            res.writeHead(200, { "Content-Type": "text/plain",'Access-Control-Allow-Origin': '*'});
            var js = JSON.parse(body);
            var jss = JSON.stringify(js);
            console.log('body: ' + body);
            //console.log('body name' + body_name);
            res.end(jss);
        });
    }

    else {
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