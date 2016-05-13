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
const PORT=3000;

router.use(bodyParser.urlencoded({extended: false}));

router.use(express.static('app'));

router.get('/post_tokens', function(req, res){
	//res.sendFile(__dirname + "/" + "index.html");
	var url = JSON.parse(JSON.stringify(req._parsedOriginalUrl));
	var authCode = url.query.replace('code=', '');
	
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status == 200){
			//set tokens
			console.log("get tokens");
			var res = JSON.parse(this.responseText);
			accessToken = res.access_token;
			refreshToken = res.refresh_token;
			console.log("Access: " + accessToken);
			console.log("Refresh: " + refreshToken);
			console.log("tokens set");

			var vhr = new XMLHttpRequest();
			vhr.onload = function(){
				if (this.status == 200){
					console.log("get name");
					var res = JSON.parse(this.responseText);
					username = res.user.fullName;
					console.log("Name: " + username);
					console.log("name set");
				} else {
					console.log(this);
				}
			};
			vhr.open("GET", "https://api.fitbit.com/1/user/-/profile.json");
			vhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			vhr.send();
		} else {
			console.log(this.status);
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

router.get('/heartrate', function(req, res){
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status == 200){
			var response = JSON.parse(this.responseText);
			res.send(response);
		} else {
			console.log(this);
		}
	};
	xhr.open("GET", "https://api.fitbit.com/1/user/-/activities/heart/date/2016-04-19/2016-04-20.json");
	xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
	xhr.send();
});

router.get('/users/-/activity/:begin/:end', function(req, res){
	var start = req.params.begin;
	var end = req.params.end;
	//var act = req.params.activity;
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status == 200){
			var response = JSON.parse(this.responseText);
			res.send(response);
		} else {
			console.log(this);
		}
	};
	xhr.open("GET", "https://api.fitbit.com/1/user/-/activities/heart/date/" + start + "/" + end + ".json");
	xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
	xhr.send();
});

router.listen(PORT, function(){
	console.log("Server listening on port " + PORT);
});


