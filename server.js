"use strict"
var http = require('http');
var path = require('path');
var express = require('express');
const MongoClient = require('mongodb').MongoClient;
const user = require('./userMaintenance');
const api = require('./apiTools');
const mongoRoutes = require('./mongoRoutes');
var router = express();
var bodyParser = require('body-parser');
var $ = require('jquery');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var clientId = "227H8D";
var clientEncoded = "MjI3SDhEOmJmODg0ZmExMjBmMzE0MjE2OGEwOTgyNTdlMzRlYTEz";
var accessToken = "";
var refreshToken = "";
var username = "";
var urls = ["activities/calories", "activities/distance", "activities/minutesSedentary", "activities/minutesLightlyActive", "activities/minutesFairlyActive", "activities/minutesVeryActive", "activities/heart", "activities/steps"];
let dbURL = 'mongodb://localhost:27017/tokens';
const PORT = 3000;

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(express.static('app'));

router.get('/getAllData/:begin/:end/:interval', (req, res) => {
    var start = req.params.begin;
    var end = req.params.end;
    var interval = req.params.interval;
    let fulfilled = 0;
    let max = 0;
    let resultArray = [];
    let promises = [];
    let sd = new Date(start);
    let ed = new Date(end);
    user.getUsers({}, (us) => {
        while (sd <= ed) {
            us.forEach((d) => {
                let userData = [];
                urls.forEach((u) => {
                    let url = `https://api.fitbit.com/1/user/${d.encodedId}/${u}/date/${start}/${start}/${interval}.json`;
                    userData.push(api.callFitbit("GET", url, d.encodedId, d.accessToken));
                });
                max++;
                promises.push(userData);
            });
            sd.setDate(sd.getDate() + 1);
            start = formatDate(sd);
        }
    });
    promises.forEach((userArray) => {
        Promise.all(userArray).then((values) => {
            let id = values[0].id;
            values = values.map((d) => d.vals);
            values = [{
                "name": id
            }].concat(values);

            resultArray.push(values);
            fulfilled++;
        }, (reason) => {
            console.log(reason);
        });
    });

    function finisher() {
        setTimeout(() => {
            if (fulfilled === max) {
                let transformed = [];
                transformed = transformed.concat(dataTransform(resultArray[0], start, end, interval));
                for (let i = 1; i < resultArray.length; i++) {
                    transformed = transformed.concat(dataTransform(resultArray[i], start, end, interval, false));
                }

                res.send(transformed);

            } else {
                console.log('not finished ful: ', fulfilled, " max ", max);
                finisher();
            }
        }, 500)
    }
    finisher();
});

router.get('/getHeartRates', (req, res) => {
    user.getUsers({}, (us) => {
        let results = [];
        us.forEach((d) => {
            results.push(api.callFitbit("GET", "https://api.fitbit.com/1/user/" + d.encodedId + "/activities/heart/2016-05-09.json", d.encodedId, d.accessToken));
        });
        Promise.all(results).then((values) => {
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
    var params = "client_id=" + clientId + "&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fpost%5Ftokens&code=" + authCode;
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

var data = [];

//Takes a dateTime object and returns a format usable in the API requests
var formatDate = function(date) {
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var day = date.getDate() + 1;
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
    getActivityData(urls[index], sd, ed, interval).then(function() {
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

var padZero = function(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}

//Takes a dateTime object and returns a format usable in the API requests
var formatDate = function(date) {
    var month = date.getMonth() + 1;
    month = padZero(month);

    var day = date.getDate() + 1;
    day = padZero(day);

    var year = date.getFullYear();

    return year + "-" + month + "-" + day;
}

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

var getProperties = function(obj) {
    var result = [];
    for (var key in obj) {
        result.push(key);
    }
    return result;
}

var mergeData = function(fin, data, index, interval, headers) {
    if (headers === undefined || headers === true) {

        var finIndex = ((index - 1) % urls.length) + 1;
    } else {
        var finIndex = ((index - 1) % urls.length);
    }
    console.log(fin, finIndex);
    var properties = getProperties(data[index]);
    if (index <= urls.length) {
        fin[finIndex].push(data[0].name);
        fin[finIndex].push(properties[0]);
    }

    var set = data[index][properties[1]].dataset;
    if (set.length < 1440 / interval) {
        //do this
        for (var i = 0; i < 1440 / interval; i++) {
            fin[finIndex].push(0);
        }
        for (var i = 0; i < set.length; i++) {
            var d = data[index][properties[0]][0].dateTime;
            var t = set [i].time;
            var dateTime = d + " " + t;
            var foundIndex = fin[0].indexOf(dateTime);
            fin[finIndex][foundIndex] = set [i].value;
        }
    } else if (set.length > 1440 / interval) {
        //error
    } else {
        for (var i = 0; i < set.length; i++) {
            fin[finIndex].push(set [i].value);
        }
    }
}

//Transforms the data from an array to one JSON object
var dataTransform = function(data, start, end, interval, headers) {
    var finalData = [];
    var fields = ["ID", "Activity"];

    var date = new Date(start);
    date.setDate(date.getDate() + 1);
    date.setHours(0);
    var end_date = new Date(end);
    end_date.setDate(end_date.getDate() + 2);
    end_date.setHours(0);
    var span = end_date.getDate() - date.getDate();

    var inter = 0;
    if (interval == "1min") {
        inter = 1;
    } else if (interval == "15min") {
        inter = 15;
    }

    if (headers === undefined || headers === true) {
        while (date < end_date) {
            fields.push(formatDateTime(date));
            date.setMinutes(date.getMinutes() + inter);
        }
        finalData.push(fields);
    }

    for (var i = 1; i < data.length / span; i++) {
        finalData.push([]);
    }

    for (var i = 1; i < data.length; i++) {
        mergeData(finalData, data, i, inter, headers);
    }

    console.log("Transform Done");
    return finalData;
};
