"use strict"
var http = require('http');
var path = require('path');
var express = require('express');
var router = express();
var bodyParser = require('body-parser');
var $ = require('jquery');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var clientId = "227H8D";
var clientEncoded = "MjI3SDhEOmJmODg0ZmExMjBmMzE0MjE2OGEwOTgyNTdlMzRlYTEz";
var accessToken = "";
var refreshToken = "";
var username = "";
var urls = ["activities/calories", "activities/distance", "activities/minutesSedentary", "activities/minutesLightlyActive", "activities/minutesFairlyActive", "activities/minutesVeryActive", "activities/heart", "activities/steps"];//, "sleep/efficiency", "sleep/minutesAsleep"];
var PORT=3000;

router.use(bodyParser.urlencoded({extended: false}));

router.use(express.static('app'));

//Gets the Authorization Code from when a user authorizes our app
//Uses the Authorization Code to get the access and refresh tokens for the user
router.get('/post_tokens', function(req, res) {
    var results = [];
    var url = JSON.parse(JSON.stringify(req._parsedOriginalUrl));
    var authCode = url.query.replace('code=', '');

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            var res = JSON.parse(this.responseText);

            var accessToken = res.access_token;
            var refreshToken = res.refresh_token;

            var vhr = new XMLHttpRequest();
            vhr.onload = function() {
                if (this.status == 200) {
                    var userObj = JSON.parse(this.responseText);
                    MongoClient.connect(dbURL, (err, db) => {
                        user.registerUser(res, userObj, db, () => {
                            db.close()
                        })
                    })
                } else {
                    console.log('err post status ', this.status);
                }
            };
            vhr.open("GET", "https://api.fitbit.com/1/user/-/profile.json");
            vhr.setRequestHeader("Authorization", "Bearer " + accessToken);
            vhr.send();
        } else {
            console.log(this);
        }
    };
    xhr.open("POST", "https://api.fitbit.com/oauth2/token");
    xhr.setRequestHeader("Authorization", "Basic " + clientEncoded);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params = "client_id=" + clientId + "&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fpost%5Ftokens&code=" + authCode;
    xhr.send(params);

    res.redirect("/");
});

//Not for use in final build
router.get('/getHeart/:begin/:end', function(req, res){
	var start = req.params.begin;
	var end = req.params.end;
	//var act = req.params.activity;
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status == 200){
			dataString = this.responseText;
			console.log(dataString);
			//var response = JSON.parse(this.responseText);
			//res.send(response);
		} else {
			console.log(this);
		}
	};
	xhr.open("GET", "https://api.fitbit.com/1/user/-/activities/heart/date/" + start + "/" + end + ".json");
	xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
	xhr.send();
});

//Not for use in final build
router.get('/getSteps/:begin/:end', function(req, res){
	var start = req.params.begin;
	var end = req.params.end;
	//var act = req.params.activity;
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status == 200){
			dataString = this.responseText;
			console.log(dataString);
			//console.log(response.activities-heart);
			//console.log(response.activities-steps);
			var response = JSON.parse(this.responseText);
			res.send(response);
		} else {
			console.log(this);
		}
	};
	xhr.open("GET", "https://api.fitbit.com/1/user/-/activities/steps/date/2016-05-02/2016-05-02/1min.json");
	xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
	xhr.send();
});

var data = [];

//Takes a dateTime object and returns a format usable in the API requests
var formatDate = function(date){
	var month = date.getMonth()+1;
	if(month < 10){
		month = "0" + month;
	}
	var day = date.getDate()+1;
	if(day < 10){
		day = "0" + day;
	}
	var year = date.getFullYear();
	return year + "-" + month + "-" + day;
}

//Transforms the data from an array to one JSON object
var dataTransform = function(data){
	return data;
};

//Sends a specific API request to get user data
var getActivityData = function(url, sd, ed, interval){
	var start = formatDate(sd);
	return new Promise(function(resolve, reject){
		var xhr = new XMLHttpRequest();
		xhr.onload = function(){
			if(xhr.status == 200){
				data.push(JSON.parse(this.responseText));
				resolve(data);
			} else {
				reject(Error(xhr.statusText));
			}
		};
		xhr.open("GET", "https://api.fitbit.com/1/user/-/" + url + "/date/" + start + "/" + start + "/" + interval + ".json");
		xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
		xhr.send();
	});
};

//Loops through all API calls and all dates in date range
//Adds all data to the data array
//Transforms the data into JSON and sends it client side
var loopUrls = function(index, sd, ed, interval, res){
	getActivityData(urls[index], sd, ed, interval).then(function(){
		if(++index < urls.length){
			loopUrls(index, sd, ed, interval, res);
		} else {
			if(sd < ed){
				sd.setDate(sd.getDate() + 1);
				loopUrls(0, sd, ed, interval, res);
			} else {
				dataTransform(data);
				res.send(data);
			}
		}
	});
};

//Route called to get all user data
router.get('/getData/:begin/:end/:interval', function(req, res){
	var start = req.params.begin;
	var end = req.params.end;
	var interval = req.params.interval;
	var sd = new Date(start);
	var ed = new Date(end);
	data.push(JSON.parse("{\"name\": \"" + username + "\"}"));
	loopUrls(0, sd, ed, interval, res);
});

router.listen(PORT, function(){
	console.log("Server listening on port " + PORT);
});


