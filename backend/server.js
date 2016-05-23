"use strict"
var http = require('http');
var path = require('path');
var express = require('express');
const MongoClient = require('mongodb')
    .MongoClient;
const user = require('./userMaintenance');
const api = require('./apiTools');
const mongoRoutes = require('./mongoRoutes');
var router = express();
var bodyParser = require('body-parser');
var $ = require('jquery');
var XMLHttpRequest = require('xmlhttprequest')
    .XMLHttpRequest;
var clientId = "227H8D";
var clientEncoded = "MjI3SDhEOmJmODg0ZmExMjBmMzE0MjE2OGEwOTgyNTdlMzRlYTEz";
var accessToken = "";
var refreshToken = "";
var username = "";
var urls = ["activities/calories", "activities/distance", "activities/minutesSedentary", "activities/minutesLightlyActive", "activities/minutesFairlyActive", "activities/minutesVeryActive", "activities/heart", "activities/steps"];
//var urls = ["activities/calories", "activities/heart"]
let dbURL = 'mongodb://localhost:27017/tokens';
const PORT = 22205;

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(express.static(__dirname + '/../app'));

function getUTC(date) {
    var date_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return date_utc;
}
router.get('/getAllData/:begin/:end/:interval', (req, res) => {
    let start = new Date(req.params.begin).getTime();
    let end = new Date(req.params.end).getTime();
	console.log("Start string:",req.params.begin,"start",start,"End String",req.params.end,"end",end);
    let intervalString = req.params.interval;
	console.log("intervalString",intervalString);
    let interval = +intervalString.substring(0, intervalString.length - 3);

    let datesbtn = 1 + ((end - start) / 86400000);
	console.log("dates between",datesbtn);

    let fulfilled = 0;

    let resultArray = [];

	let max = 0;

    user.getUsers({}, (us) => {

        max = us.length;

        let promises = [];
        us.forEach((d) => {
            let userData = [];
            urls.forEach((u) => {
                let startCopy = start;
                while (startCopy <= end) {
					console.log("START",startCopy,"END",end);
                    let url = `https://api.fitbit.com/1/user/${d.encodedId}/${u}/date/${formatDate(new Date(startCopy))}/${formatDate(new Date(startCopy))}/${intervalString}.json`;
                    console.log("URL",url);
                    userData.push(api.callFitbit("GET", url, d.encodedId, d.accessToken));
                    startCopy += 24 * 60 * 60 * 1000;
                }
            });
            promises.push(userData);
        });
        promises.forEach((userArray) => {
            Promise.all(userArray)
                .then((values) => {
                    let id = values[0].id;
                    values = values.map((d) => d.vals);
                    values = [{
                        "name": id
                    }].concat(values);

                    resultArray.push(values);
                    fulfilled++;
                }, (reason) => {});
        });

    });

    (function finisher() {
        setTimeout(() => {
            if (fulfilled === max) {
                let transformed = [];

                let results = [];
                let headers = generateHeaders(start, end, interval);
                results.push(headers)

                for (let i = 0; i < resultArray.length; i++) {
                    results = results.concat(dataTransform(resultArray[i], datesbtn, headers));
                }

                res.send(results);

            } else {
                console.log('not finished ful: ', fulfilled, " max ", max);
                finisher();
            }
        }, 500)
    })();
});

let generateHeaders = (start, end, interval) => {
    let fields = ["ID", "Activity"];
    let startCopy = start;

    while (startCopy < end + 24 * 60 * 60 * 1000) {
        fields.push(formatDateTime(new Date(startCopy)));
        startCopy += interval * 60000;
    }
    return fields;
};

router.get('/getHeartRates', (req, res) => {
    user.getUsers({}, (us) => {
        let results = [];
        us.forEach((d) => {
            results.push(api.callFitbit("GET",
                `https://api.fitbit.com/1/user/${d.encodedId}/activities/heart/2016-05-09.json`,
                d.encodedId, d.accessToken));
        });
        Promise.all(results)
            .then((values) => {
                console.log('done');
            }, (reason) => {
                console.log("call Error: ", reason);
            });
    });
});

//Gets the Authorization Code from when a user authorizes our app
//Uses the Authorization Code to get the access and refresh tokens for the user
router.get('/post_tokens', function(req, res) {
    let results = [];
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
    var params = "client_id=" + clientId + "&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost:22205%2Fpost%5Ftokens&code=" + authCode;
    xhr.send(params);

    res.redirect("/");
});

//Not for use in final build
router.get('/getHeart/:begin/:end', function(req, res) {
    var start = req.params.begin;
    var end = req.params.end;
    //var act = req.params.activity;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            dataString = this.responseText;
            console.log(dataString);
        } else {
            console.log(this);
        }
    };
    xhr.open("GET", "https://api.fitbit.com/1/user/-/activities/heart/date/" + start + "/" + end + ".json");
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
    xhr.send();
});

//Not for use in final build
router.get('/getSteps/:begin/:end', function(req, res) {
    var start = req.params.begin;
    var end = req.params.end;
    //var act = req.params.activity;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
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

var padZero = (val) => val < 10 ? "0" + val : val;

var data = [];

//Takes a dateTime object and returns a format usable in the API requests
var formatDate = function(date) {
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var year = date.getFullYear();
    return year + "-" + month + "-" + day;
}

//Sends a specific API request to get user data
var getActivityData = function(url, sd, ed, interval) {
    var start = formatDate(sd);
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
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
var loopUrls = function(index, sd, ed, interval, res) {
    getActivityData(urls[index], sd, ed, interval)
        .then(function() {
            if (++index < urls.length) {
                loopUrls(index, sd, ed, interval, res);
            } else {
                if (sd < ed) {
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
router.get('/getData/:begin/:end/:interval', function(req, res) {
    var start = req.params.begin;
    var end = req.params.end;
    var interval = req.params.interval;
    var sd = new Date(start);
    var ed = new Date(end);
    data.push(JSON.parse("{\"name\": \"" + username + "\"}"));
    loopUrls(0, sd, ed, interval, res);
});

router.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
});

var formatDateTime = function(date) {
    var month = date.getMonth() + 1;
    month = padZero(month);

    var day = date.getDate();
    day = padZero(day);

    var year = date.getFullYear();

    var hours = date.getHours();
    hours = padZero(hours);

    var mins = date.getMinutes();
    mins = padZero(mins);

    var secs = date.getSeconds();
    secs = padZero(secs);

    return year + "-" + month + "-" + day + " " + hours + ":" + mins + ":" + secs;
}

//Transforms the data from an array to one JSON object
var dataTransform = function(data, datesbtwn, headers) {
    let rowObj = {};
    let results = [];
    let curRow;
    let id = data[0].name;
    for (let i = 1; i < data.length; i++) {
        let urlIndex = Math.floor((i - 1) / datesbtwn);
		//console.log("urlIndex",urlIndex);
        let activity = urls[urlIndex].replace('/', '-');
		//console.log("data",data[i],"activity",activity);
        if (rowObj[activity] === undefined) rowObj[activity] = [];
		if (activity == "activities-heart") {
			//put "." for times with no heart data
			//FIXME this is a non-optimal solution
			//I apologize for how disgusting this is
			console.log("------------------START HEART PROCESSING-------------------");
			var dayString = data[i]["activities-heart"][0]["dateTime"];
			//var dayHeaders = headers.filter((el) => el.includes(dayString));
			var dayDate = new Date(dayString);
			dayDate.setDate(dayDate.getDate() + 1);
			var nextDayString = dayDate.toISOString().split("T")[0];
			var dayIndex = headers.indexOf(dayString + " 20:00:00");
			var nextDayIndex = headers.indexOf(nextDayString + " 20:00:00", dayIndex);
			console.log("dayString, nextDayString, dayIndex, nextDayIndex", dayString, nextDayString, dayIndex, nextDayIndex);
			//ternary operator here catches the case where nextDay is -1
			//should be -1 only when it's not found because headers end at nextDay + 19:59:00
			var dayHeaders = headers.slice(dayIndex, (nextDayIndex === -1) ? headers.length : nextDayIndex);
			console.log("dayHeaders begin, end, length", dayHeaders[0], dayHeaders[dayHeaders.length -1], dayHeaders.length);
			var timeMap = new Map(dayHeaders.map((d, i) => [d.split(" ")[1], i]));
			console.log("timeMap size", timeMap.size);
			var result = Array.from([].fill.call({ length: dayHeaders.length }, "."));
			console.log("result length after fill", result.length);
			var dataset = data[i][activity + '-intraday'].dataset;
			console.log("dataset begin, end, length", dataset[0], dataset[dataset.length - 1], dataset.length);
			var numUndefined = 0;
			data[i][activity + '-intraday'].dataset.forEach((d) => {
				//timeMap.set(dayString + " " + d.time, d.value);
				//if ( timeMap.get(dayString + " " + d.time) === undefined) {
				if ( timeMap.get(d.time) === undefined) {
						//console.log("this was undefined", dayString + " " + d.time)
						numUndefined++;
				}
				//result[timeMap.get(dayString + " " + d.time)] = d.value;
				result[timeMap.get(d.time)] = d.value;

			});
			console.log("numUndefined", numUndefined);
			console.log("result length after populate", result.length);
			console.log("original data length vs non '.' result length", data[i][activity + '-intraday'].dataset.length, result.filter((d) => d != ".").length);
			rowObj[activity] = rowObj[activity].concat(result);
			
		} else {
				rowObj[activity] = rowObj[activity].concat(data[i][activity + '-intraday'].dataset.map((d) => d.value));
		}
    }

    for (let activity of Object.keys(rowObj)) {
        console.log('activity', activity);
        let result = [];
        result.push(id);
        result.push(activity);
        result = result.concat(rowObj[activity]);

        results.push(result);
    }
    return results;
};
