var XMLHttpRequest = require('xmlhttprequest')
    .XMLHttpRequest;
const MongoClient = require('mongodb')
    .MongoClient;
const userMaintenance = require('./userMaintenance');
const mongoRoutes = require('./mongoRoutes');
var dbURL = 'mongodb://localhost:27017/tokens';

exports.callFitbit = (verb, path, userId, accessToken) => {
    return new Promise((resolve, reject) => {
        var sendRequest = function () {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                console.log('status ', this.status, ' ', userId)
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    resolve({
                        "vals": response,
                        "id": userId
                    });
                } else if (this.status == 401) {
					console.log("call returned 401, need to refresh token");
                    //need to refresh token
                    userMaintenance.refreshToken(userId);
					//get new accessToken
					function cb(users) {
						console.log(users, accessToken);
						accessToken = users[0].encodedId;
						console.log("New access token received, sending request again now");
						sendRequest();
					}
					userMaintenance.getUsers({"encodedId": userId}, cb);
                } else if (this.status == 429) {
                    //too many requests
					var nowTime = new Date();
					timeTillHour = (61 - nowTime.getMinutes()) * 60 * 1000;
					console.log("call returned 429 at", nowTime, "calling again in", timeTillHour);
                    setTimeout(sendRequest, timeTillHour);
                } else {
                    reject(this);
                }
            }
            xhr.open(verb, path);
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
            xhr.send();
        }
		sendRequest();
    });
}
