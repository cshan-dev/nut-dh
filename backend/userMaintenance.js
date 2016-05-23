"use strict"
var XMLHttpRequest = require('xmlhttprequest')
    .XMLHttpRequest;
var MongoClient = require('mongodb')
    .MongoClient;
var dbURL = 'mongodb://localhost:27017/tokens';
var clientId = "227H8D";
var clientEncoded = "MjI3SDhEOmJmODg0ZmExMjBmMzE0MjE2OGEwOTgyNTdlMzRlYTEz";

exports.registerUser = (res, user, db, callback) => {
    db.collection('users').findAndModify({
        "encodedId": user.user.encodedId
    }, [
        ['_id', 'asc']
    ], {
        "$setOnInsert": {
            "encodedId": user.user.encodedId
        },
        "$set": {
            "accessToken": res.access_token,
            "refreshToken": res.refresh_token,
        }
    }, {
        "upsert": true,
    }, (err, object) => {
        if (err) {
            console.log(err.message);
        } else {}
        callback()
    })
};

exports.refreshToken = (id, callback) => {
    exports.getUsers({
        "encodedId": id
    }, (u) => {
        MongoClient.connect(dbURL, (err, db) => {
            var refresh = new XMLHttpRequest();
            refresh.onload = function() {
                let newRes = JSON.parse(this.responseText);
                if (this.status = 200) {
					console.log("got new refreshToken", newRes);
                    exports.registerUser(newRes, {
                        "user": {
                            "encodedId": id
                        }
                    }, db, () => db.close());
					callback(newRes);
                } else {
                    console.log('Refresh Token Call: status ', this.status)
                }
            }
            refresh.open("POST", "https://api.fitbit.com/oauth2/token");
            refresh.setRequestHeader("Authorization", "Basic " + clientEncoded);
            refresh.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            var params = "grant_type=refresh_token&refresh_token=" + u[0].refreshToken;
            refresh.send(params);
        });
    });
};

exports.getUsers = (query, callback) => {
    MongoClient.connect(dbURL, (err, db) => {
        ((db, callback) => {
            let cursor = db.collection('users').find(query);
            var users = [];
            cursor.each((err, doc) => {
                if (err) {
                    console.log("err getting users", err)
                }
                if (doc != null) {
                    users.push(doc);
                } else {
                    callback(users);
                }
            });
        })(db, callback);
    });
}
