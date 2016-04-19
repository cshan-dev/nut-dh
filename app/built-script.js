(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var data = [["row", "total_bill", "tip", "sex", "smoker", "day", "time", "size"], ["1", 16.99, 1.01, "Female", "No", "Sun", "Dinner", 2], ["2", 10.34, 1.66, "Male", "No", "Sun", "Dinner", 3], ["3", 21.01, 3.5, "Male", "No", "Sun", "Dinner", 3], ["4", 23.68, 3.31, "Male", "No", "Sun", "Dinner", 2]];

var utils = $.pivotUtilities;
var heatmap = utils.renderers["Heatmap"];
var sumOverSum = utils.aggregators["Sum over Sum"];

$("#output").pivotUI(data, {
	rows: ["sex", "smoker"],
	cols: ["day", "time"],
	aggregator: sumOverSum(["tip", "total_bill"]),
	renderer: heatmap
});

var accessToken = "";
var refreshToken = "";

var clientId = "227H8D";
var clientSecret = "bf884fa120f3142168a098257e34ea13";

//[clientId]:[clientSecret] encoded with Base64
//used in Authoriation header
var clientEncoded = "MjI3SDhEOmJmODg0ZmExMjBmMzE0MjE2OGEwOTgyNTdlMzRlYTEz";

var getAccessToken = function getAccessToken() {
	console.log("getting access token");
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (this.status == 200) {
			//set tokens
			var res = JSON.parse(this.response);
			accessToken = res.access_token;
			refreshToken = res.refresh_token;
			console.log("tokens set");
		} else {
			console.log(this.status);
			console.log(this);
		}
	};
	xhr.open("POST", "https://api.fitbit.com/oauth2/token");
	var authCode = window.location.search.substring(1).replace('code=', '');
	xhr.setRequestHeader("Authorization", "Basic " + clientEncoded);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var params = "client_id=" + clientId + "&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost:3000%2F&code=" + authCode;
	xhr.send(params);
};

//gets users steps dating back 7 days from today
var getSteps = function getSteps() {
	console.log("getting activites");
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (this.status == 200) {
			console.log(this);
			$('#data').html(this.response);
		} else {
			console.log(this);
		}
	};
	xhr.open("GET", "https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json");
	xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
	xhr.send();
};

$('#getToken').click(getAccessToken);
$('#getInfo').click(getSteps);

},{}]},{},[1]);
