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
//var urls = ["activities/calories", "activities/distance", "activities/minutesSedentary", "activities/minutesLightlyActive", "activities/minutesFairlyActive", "activities/minutesVeryActive", "activities/heart", "activities/steps"];
var urls = ["activities/calories", "activities/distance"]
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
    var start = req.params.begin;
    var end = req.params.end;
    let originalStart = new Date(start);
    originalStart.setDate(originalStart.getDate() + 1)
    originalStart.setHours(0);

    let originalEnd = new Date(end);
    originalEnd.setDate(originalEnd.getDate() + 1)
    originalEnd.setHours(0);
    var interval = req.params.interval;

    let datesbtn = 1 + ((originalEnd.getTime() - originalStart.getTime()) / 86400000);

    let fulfilled = 0;
    let max = 0;


    let resultArray = [];

    user.getUsers({}, (us) => {
        let sd = new Date(start);
        sd.setDate(sd.getDate() + 1)
        sd.setHours(0);

        let ed = new Date(end);
        ed.setDate(ed.getDate() + 1)
        ed.setHours(0);

        max = us.length;

        let promises = [];
        us.forEach((d) => {
            let userData = [];
            urls.forEach((u) => {
                while (sd.getTime() <= ed.getTime()) {
                    console.log('formatting', sd, formatDate(sd));
                    let url = `https://api.fitbit.com/1/user/${d.encodedId}/${u}/date/${formatDate(sd)}/${formatDate(sd)}/${interval}.json`;
                    userData.push(api.callFitbit("GET", url, d.encodedId, d.accessToken));
                    sd.setDate(sd.getDate() + 1);
                }
                sd = new Date(start);
                sd.setDate(sd.getDate() + 1)
                sd.setHours(0);

            });
            promises.push(userData);
        });
        console.log("PRAMPISUS", sd, promises.length, promises);
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
                }, (reason) => {
                    //console.log("reason?", reason);
                });
        });

    });

    (function finisher() {
        setTimeout(() => {
            if (fulfilled === max) {
                //console.log('IF not finished ful: ', fulfilled, " max ", max);
                let transformed = [];
                //console.log("RESULTS", resultArray[1][1]);
                transformed = transformed.concat(dataTransform(resultArray[0], originalStart, originalEnd, interval));
                for (let i = 1; i < resultArray.length; i++) {
                    if (i % datesbtn === 0) {
                        transformed.push((dataTransform(resultArray[i], originalStart, originalEnd, interval, false)));
                    } else {
                        transformed[i % datesbtn] = transformed.concat(dataTransform(resultArray[i], originalStart, originalEnd, interval, false));
                    }
                    console.log
                }

                res.send(transformed);
                //res.send("done!")

            } else {
                console.log('not finished ful: ', fulfilled, " max ", max);
                finisher();
            }
        }, 500)
    })();
    //	setTimeout(finisher, 0)
    //finisher();
});

router.get('/getHeartRates', (req, res) => {
    user.getUsers({}, (us) => {
        let results = [];
        us.forEach((d) => {
            results.push(api.callFitbit("GET", "https://api.fitbit.com/1/user/" + d.encodedId + "/activities/heart/2016-05-09.json", d.encodedId, d.accessToken));
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
router.get('/post_tokens', function (req, res) {
    let results = [];
    var url = JSON.parse(JSON.stringify(req._parsedOriginalUrl));
    var authCode = url.query.replace('code=', '');

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status == 200) {
            var res = JSON.parse(this.responseText);

            var accessToken = res.access_token;
            var refreshToken = res.refresh_token;

            var vhr = new XMLHttpRequest();
            vhr.onload = function () {
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
router.get('/getHeart/:begin/:end', function (req, res) {
    var start = req.params.begin;
    var end = req.params.end;
    //var act = req.params.activity;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status == 200) {
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
router.get('/getSteps/:begin/:end', function (req, res) {
    var start = req.params.begin;
    var end = req.params.end;
    //var act = req.params.activity;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
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
var formatDate = function (date) {
    console.log('DATEED', date);
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
var getActivityData = function (url, sd, ed, interval) {
    var start = formatDate(sd);
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
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
var loopUrls = function (index, sd, ed, interval, res) {
    getActivityData(urls[index], sd, ed, interval)
        .then(function () {
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
router.get('/getData/:begin/:end/:interval', function (req, res) {
    var start = req.params.begin;
    var end = req.params.end;
    var interval = req.params.interval;
    var sd = new Date(start);
    var ed = new Date(end);
    data.push(JSON.parse("{\"name\": \"" + username + "\"}"));
    loopUrls(0, sd, ed, interval, res);
});

router.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
});

var formatDateTime = function (date) {
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
var dataTransform = function (data, start, end, interval, headers) {
    console.log('start and end', start, end);
    let datesbtn = 1 + ((end.getTime() - start.getTime()) / 86400000);
	var startCopy = new Date(end.getTime());
	var endPlus1 = new Date(end.getTime());
    endPlus1.setDate(endPlus1.getDate() + 1)
    var finalData = [];
    var fields = ["ID", "Activity"];

    var inter = 0;
    if (interval == "1min") {
        inter = 1;
    } else if (interval == "15min") {
        inter = 15;
    }

    if (headers === undefined || headers === true) {
        while (startCopy.getTime() < endPlus1.getTime()) {
            fields.push(formatDateTime(startCopy));
            startCopy.setMinutes(startCopy.getMinutes() + inter);
        }
        finalData.push(fields);
    }

    console.log("DATA", data);
    for (let i = 1; i < data.length; i++) {
        let urlIndex = Math.floor((i - 1) / datesbtn);
		console.log("data[i]", data[i]);	
		console.log("urlIndex", urlIndex, urls[urlIndex]);
        let results = data[i][urls[urlIndex].replace('/', '-') + '-intraday'].dataset.map((d) => d.value);
        results = [data[0].name, urls[urlIndex].replace('/', '-')].concat(results);
        finalData.push(results);
    }

    let final = [finalData[0]];
    for (let i = 1; i < finalData.length; i++) {
        let urlIndex = Math.floor((i - 1) / datesbtn);
        if (final[urlIndex + 1] === undefined) {
            final[urlIndex + 1] = []
        }else{
			finalData[i].shift();	
			finalData[i].shift();	
		}
        final[urlIndex + 1] = final[urlIndex + 1].concat(finalData[i]);
    }

    console.log("Transform Done");
    return final;
};
