"use strict"
var http = require('http');
var path = require('path');
var express = require('express');
var router = express();
var bodyParser = require('body-parser');
var $ = require('jquery');
var XMLHttpRequest = require('xmlhttprequest')
    .XMLHttpRequest;
var MongoClient = require('mongodb')
    .MongoClient;
var dbURL = 'mongodb://localhost:27017/tokens';
var clientId = "227H8D";
var clientEncoded = "MjI3SDhEOmJmODg0ZmExMjBmMzE0MjE2OGEwOTgyNTdlMzRlYTEz";
var username = "";
const PORT = 3000;

var registerUser = (user, db, callback) => {
    console.log('registering user')
    db.collection('users')
        .insert({
            "accessToken": user.accessToken,
            "refreshToken": user.refreshToken,
            "encodedId": user.encodedId
        }, (err, result) => {
            callback(result);
        })
}

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(express.static('app'));

var findUser = (userId, db, callback) => {
    var cursor = db.collection('users')
        .find()
    cursor.each((err, doc) => {
        console.log(doc)
            //callback(doc);
    })
}

var registerUser2 = (res, user, db, callback) => {
		console.log(user.encodedId)
    db.collection('users').findAndModify({
        "query": {
            "encodedId": user.encodedId
        },
        "update": {
            "$setOnInsert": {
                "accessToken": res.access_token,
                "refreshToken": res.refresh_token,
                "encodedId": user.encodedId
            }
        },
        "upsert": true,
        "new": true
    });
}

router.get('/post_tokens', function(req, res) {
    var url = JSON.parse(JSON.stringify(req._parsedOriginalUrl));
    var authCode = url.query.replace('code=', '');

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            console.log("get tokens");
            var res = JSON.parse(this.responseText);

            var accessToken = res.access_token;
            var refreshToken = res.refresh_token;

            var vhr = new XMLHttpRequest();
            vhr.onload = function() {
                if (this.status == 200) {
                    console.log('  got user');
                    var userObj = JSON.parse(this.responseText);
                    MongoClient.connect(dbURL, (err, db) => {
                        console.log('finding user')
                        registerUser2(res, userObj, db, () => {
                                db.close()
                            })
                            // findUser(userObj.user.encodedId, db, (doc) => {
                            //     console.log('user found? ', doc)
                            //     if (doc === null) {
                            //         console.log('new user')
                            //         let user = {
                            //             "accessToken": res.access_token,
                            //             "refreshToken": res.refresh_token,
                            //             "encodedId": userObj.user.encodedId
                            //         }
                            //         registerUser(user, db, () => {
                            //             db.close()
                            //         })
                            //     }
                            // })
                    })
                } else {
                    console.log(this);
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

router.get('/heartrate', function(req, res) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
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

router.get('/users/-/activity/:begin/:end', function(req, res) {
    var start = req.params.begin;
    var end = req.params.end;
    //var act = req.params.activity;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
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

router.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
});
