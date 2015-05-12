/**
 * Created by Cao Likang on 10/04/15.
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
            var query = body.sName;
            var days = body.hDays;
            var keywords = body.hKeywords;

            clkTest(query, keywords, days);
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
                    finalTotal.push(['total',sortKW[i]]);
                }

                console.log(finalTotal); 

            }
        }
    }     
}
    
      
}).listen(portNo);
        



