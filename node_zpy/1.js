var Twitter = require('twit');
var client = new Twitter({
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
var accessToken = 'ODE0Z03UDW2YFXJPOWI4TQFSO0D4GHWIJF12IQHMJDTIMJ0U' ;
//https://api.foursquare.com/v2/checkins/resolve?shortId=fcP5m3yn7AL&oauth_token=
// Set the headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}



module.exports = {
  setUpAndConnectMySQL: function (connection)
  {
       var Venuedata = [];
      connection.connect();
      var queryStr = connection.query('SELECT * FROM locationVisited');
      connection.query(queryStr,function(err,rows,fields){
          if(err) throw err;
          for (var i in rows) {
          console.log('field: ', rows[i].id);
          }
      });
  },
  InsertVenueToMySql: function(connection,vn,va,vu)
  {

    //var querystr = 'insert into venueinfo set venuename= ? abstract = ? venueurl = ?',[venuename,abstract,venueurl]);
    connection.query('insert into venueinfo {{set data}}',{data:{venuename:vn ,venueabstract:va ,venueurl:vu}});;

  },
  
  concatenateNames: function (name, surname) 
  {
     var wholeName = name + " " + surname;

     return wholeName;
  },

  sampleFunctionTwo: function () 
  {
    return "helloworld";
  },
  
  insertToArray:function(array,data){
    console.log(data);
    var result = Json.parse(data);
    var date =1;
    var aut=1;
    var cont=1;
    array.push({id:array.length+1,date:date,author:aut,content:cont});

    return array;
  },

  test: function(data){
      console.log('%%%%%%'+data);
  },

  getTwitter:function(){
      var params = {
        q: 'sufc',
        c: '53.38,-1.46,20mi',
        count:'10'
        };
      client.get('search/tweets', params, function(err, data, res){
        console.log(data);
        return data;
      });
  },

}

var privateFun = function()
{
  // private function in this file
}

