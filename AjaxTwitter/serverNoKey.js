/**
 * Created by fabio on 18/02/15.
 */
var protocol = require('http');
var static = require('node-static');
var url = require('url');
var file = new (static.Server)();
var portNo = 3001;
var Twit = require('twit');
var client = new Twit({
    consumer_key:'KqSwjxpILibAwvkp1NUlDiRG5',
    consumer_secret:'gShUx9KWb5rPNq1jIIl3uvrexn4C3gDQFLvCLWFPK52VXNSzDO',
    access_token:'2733595048-JBDV7o37SavmCouiYjANg3w6KXJxaD2ek3qyYsz',
    access_token_secret:'dPlTwlUvHP1cGb2CW6rXrXxqvl3v8pdlPDyPDjtGEDfR5'
});


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
    if ((req.method == 'POST') && (pathname == '/postFile.html')) {
        var dataFin = {ok: 'ok'};
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            body= JSON.parse(body);
            var query= body.query;
            client.get('search/tweets', { q: query, count: 100 },
                            function (err, data, response) {
                                for (var indx in data.statuses) {
                                    var tweet = data.statuses[indx];
                                    console.log('on: ' + tweet.created_at + ' : @' + addslashes(tweet.user.screen_name) + ' : ' + addslashes(tweet.text) + '\n\n');
                                    res.writeHead(200, { "Content-Type": "application/json",'Access-Control-Allow-Origin': '*'});
                                    console.log('body: ' + data);
                                    res.end(JSON.stringify(data));
                                }
                            });


//            waitCallBack(5000, function () {
//                res.writeHead(200, {"Content-Type": "text/plain"});
//                console.log('body: ' + body);
//                res.end(JSON.stringify(body));
//            });
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