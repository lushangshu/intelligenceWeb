/**
 * Created by fabio on 24/02/15.
 */

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


var request = require('request');

// Set the headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}


function getCheckin(checkinId, oAuthTkn) {

// Configure the request
    var options = {
        // localhost does not work if you run from localhost the server itself
        url: 'https://api.foursquare.com/v2/checkins/resolve',
        method: 'GET',
        headers: headers,
        qs: {'shortId': checkinId, 'oauth_token': oAuthTkn,
            'v': '20140806', m: 'swarm'}
    }

// Start the request
    request(options,
        function (error, response, body) {

            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
            else console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);
        });
}
//getCheckin('fcP5m3yn7AL', accessToken);

function findVenues(latitude, longitude, radius, oAuthTkn) {

// Configure the request
    var options = {
        // localhost does not work if you run from localhost the server itself
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        headers: headers,
        qs: {'ll': latitude + ',' + longitude, 'radius': radius, 'oauth_token': oAuthTkn,
            'v': '20140806', m: 'swarm'}
    }

// Start the request
    request(options,
        function (error, response, body) {

            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
            else console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);
        });
}

//findVenues(53.3829700, -1.4659000, 500, accessToken);


function getVenueFromId(id, oAuthTkn) {

// Configure the request
    var options = {
        // localhost does not work if you run from localhost the server itself
        url: 'https://api.foursquare.com/v2/venues/' + id,
        method: 'GET',
        headers: headers,
        qs: { 'oauth_token': oAuthTkn, 'v': '20140806', m: 'swarm'}
    }

// Start the request
    request(options,
        function (error, response, body) {

            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
            else console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);
        });
}
//getVenueFromId('4ef0e7cf7beb5932d5bdeb4e', accessToken);


function getUser(id, oAuthTkn) {

// Configure the request
    var options = {
        // localhost does not work if you run from localhost the server itself
        url: 'https://api.foursquare.com/v2/users/' + id,
        method: 'GET',
        headers: headers,
        qs: { 'oauth_token': oAuthTkn, 'v': '20140806', m: 'swarm'}
    }

// Start the request
    request(options,
        function (error, response, body) {

            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
            else console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);
        });
}

getUser('620652', accessToken);


