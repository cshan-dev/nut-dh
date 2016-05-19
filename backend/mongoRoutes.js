"use strict"
var MongoClient = require('mongodb')
    .MongoClient;
var dbURL = 'mongodb://localhost:27017/tokens';

var connect = exports.connect = (col, queryType, sort, callback) => {
    MongoClient.connect(dbURL, (err, db) => {
        ((db, callback) => {
            let cursor = db.collection(col)[queryType](sort);
            let results = [];
            cursor.each((err, doc) => {
                if (err) {
                    console.warn(err);
                }
                if (doc !== null) {
                    results.push(doc);
                } else {
                    callback(results);
                }
            });
        })(db, callback);
    });
}

connect("users", "find", {}, (results) => {
    console.log(results);
});
