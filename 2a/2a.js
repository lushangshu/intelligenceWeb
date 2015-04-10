/**
 * Created by fabio on 10/04/15.
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

            query1 = JSON.stringify(query);

            //键入name
            name1 = query1.split(",");
            var name2 = ['alex','tom'];
            var wordSum = [];
            var textTotal = '';
            var postData = "";

            
            client.get('search/tweets', {from: name2[0] }, function (err, data, response) {
                

                for (var indx in data.statuses) {
                    var tweet = data.statuses[indx];
                    //单个tweet
                    postData += (tweet.text+' ');
 //                   console.log(tweet.text);

                    res.writeHead(200, { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'});
                    res.end(JSON.stringify(data));

                 }
                 //总的tweet
                 textTotal += postData;
                 wordData = JSON.stringify(postData).split(" ");
//                 console.log(wordData.length);

                //每个name的keyword
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

//每一个name的word情况
                wordSum[0] = wordcount;




                //总的keyword
                var wordcountTotal = new Array(new Array(),new Array());
                wordTotal = JSON.stringify(textTotal).split(" ");
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
                                break;}
                            else
                                continue;
                        }
                     }

                //大数组--总的数据
                var name3 = [[name2[0],wordSum[0]],[1,1]];
 //               console.log(name3[0][1]);


//排序，kwNum为键入数
                var kwNum = 3;
                var sortKW = new Array(new Array(),new Array());


                for(i=0;i<kwNum;i++){

                    sortKW[i]=['',0];
                }
 //               console.log(wordcountTotal.length);

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

//排序完后的结果
                console.log(sortKW);


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
        



