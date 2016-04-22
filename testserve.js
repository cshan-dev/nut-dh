var express = require('express');
var app = express();
app.use(express.static('app'));

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = [];

    for (var i = 0; i < array.length; i++) {
        var line = [];
        for (var index in array[i]) {
            line.push(array[i][index]);
        }
        str.push(line);
    }
    return str;
}

function addCol(data, name) {
    data.forEach((row, i) => {
        if (i == 0) {
            data[i].push(name);
        } else {
            row.push(Math.floor(Math.random() * 1000));
        }
    });
}

app.get('/users/list/', (req, res) => {
    res.send(['K3242', 'H1D27']);
});

app.get('/users/:id/distance/:begin/:end', (req, res) => {
    var distance = [
        {
            "dateTime": "2016-04-15",
            "value": "5.7405"
    },
        {
            "dateTime": "2016-04-16",
            "value": "3.71278"
    },
        {
            "dateTime": "2016-04-17",
            "value": "1.9993299999999998"
    },
        {
            "dateTime": "2016-04-18",
            "value": "5.76861"
    },
        {
            "dateTime": "2016-04-19",
            "value": "4.17753"
    },
        {
            "dateTime": "2016-04-20",
            "value": "4.6783399999999995"
    }
  ]
    res.send(distance);
});

app.get('/users/:id/heartrate/:begin/:end', (req, res) => {
    var heartRate = [
        {
            "dateTime": "2016-04-10",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-11",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-12",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-13",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-14",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-15",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-16",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-17",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-18",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-19",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    },
        {
            "dateTime": "2016-04-20",
            "value": {
                "customHeartRateZones": [],
                "heartRateZones": [
                    {
                        "max": 98,
                        "min": 30,
                        "name": "Out of Range"
          },
                    {
                        "max": 137,
                        "min": 98,
                        "name": "Fat Burn"
          },
                    {
                        "max": 167,
                        "min": 137,
                        "name": "Cardio"
          },
                    {
                        "max": 220,
                        "min": 167,
                        "name": "Peak"
          }
        ]
            }
    }
  ]
    res.send(heartRate);
});

app.get('/users/:id', (req, res) => {
    var user = {
        "age": 23,
        "avatar": "https://static0.fitbit.com/images/profile/defaultProfile_100_male.gif",
        "avatar150": "https://static0.fitbit.com/images/profile/defaultProfile_150_male.gif",
        "averageDailySteps": 0,
        "corporate": false,
        "customHeartRateZone": {
            "enabled": false,
            "max": 0,
            "min": 0,
            "name": "Custom Zone"
        },
        "customMaxHeartRate": {
            "enabled": false,
            "maxHeartRate": 0
        },
        "dateOfBirth": "1992-11-16",
        "displayName": "Joshua",
        "distanceUnit": "en_US",
        "encodedId": "4CFK69",
        "features": {
            "exerciseGoal": true
        },
        "foodsLocale": "en_US",
        "fullName": "Joshua Simmons",
        "gender": "MALE",
        "glucoseUnit": "en_US",
        "height": 175.3,
        "heightUnit": "en_US",
        "locale": "en_US",
        "memberSince": "2016-02-25",
        "offsetFromUTCMillis": -25200000,
        "startDayOfWeek": "SUNDAY",
        "strideLengthRunning": 91.2,
        "strideLengthRunningType": "default",
        "strideLengthWalking": 72.7,
        "strideLengthWalkingType": "default",
        "timezone": "America/Los_Angeles",
        "topBadges": [],
        "waterUnit": "en_US",
        "waterUnitName": "fl oz",
        "weight": 63.5,
        "weightUnit": "en_US"
    }
    res.send({
        id: user.encodedId,
        height: user.height,
        weight: user.weight,
        age: user.age,
        sex: user.gender
    });
});

app.get('/users/', (req, res) => {
    var users = [{
            "age": 23,
            "avatar": "https://static0.fitbit.com/images/profile/defaultProfile_100_male.gif",
            "avatar150": "https://static0.fitbit.com/images/profile/defaultProfile_150_male.gif",
            "averageDailySteps": 0,
            "corporate": false,
            "customHeartRateZone": {
                "enabled": false,
                "max": 0,
                "min": 0,
                "name": "Custom Zone"
            },
            "customMaxHeartRate": {
                "enabled": false,
                "maxHeartRate": 0
            },
            "dateOfBirth": "1992-11-16",
            "displayName": "Joshua",
            "distanceUnit": "en_US",
            "encodedId": "4CFK69",
            "features": {
                "exerciseGoal": true
            },
            "foodsLocale": "en_US",
            "fullName": "Joshua Simmons",
            "gender": "MALE",
            "glucoseUnit": "en_US",
            "height": 175.3,
            "heightUnit": "en_US",
            "locale": "en_US",
            "memberSince": "2016-02-25",
            "offsetFromUTCMillis": -25200000,
            "startDayOfWeek": "SUNDAY",
            "strideLengthRunning": 91.2,
            "strideLengthRunningType": "default",
            "strideLengthWalking": 72.7,
            "strideLengthWalkingType": "default",
            "timezone": "America/Los_Angeles",
            "topBadges": [],
            "waterUnit": "en_US",
            "waterUnitName": "fl oz",
            "weight": 63.5,
            "weightUnit": "en_US"
        },

        {
            "age": 23,
            "avatar": "https://static0.fitbit.com/images/profile/defaultProfile_100_male.gif",
            "avatar150": "https://static0.fitbit.com/images/profile/defaultProfile_150_male.gif",
            "averageDailySteps": 0,
            "corporate": false,
            "customHeartRateZone": {
                "enabled": false,
                "max": 0,
                "min": 0,
                "name": "Custom Zone"
            },
            "customMaxHeartRate": {
                "enabled": false,
                "maxHeartRate": 0
            },
            "dateOfBirth": "1992-11-16",
            "displayName": "Joshua",
            "distanceUnit": "en_US",
            "encodedId": "4CFK69",
            "features": {
                "exerciseGoal": true
            },
            "foodsLocale": "en_US",
            "fullName": "Joshua Simmons",
            "gender": "MALE",
            "glucoseUnit": "en_US",
            "height": 175.3,
            "heightUnit": "en_US",
            "locale": "en_US",
            "memberSince": "2016-02-25",
            "offsetFromUTCMillis": -25200000,
            "startDayOfWeek": "SUNDAY",
            "strideLengthRunning": 91.2,
            "strideLengthRunningType": "default",
            "strideLengthWalking": 72.7,
            "strideLengthWalkingType": "default",
            "timezone": "America/Los_Angeles",
            "topBadges": [],
            "waterUnit": "en_US",
            "waterUnitName": "fl oz",
            "weight": 63.5,
            "weightUnit": "en_US"
        }]

    var result = [];
    var userObjs = users.forEach((user) => {
        result.push({
            "id": user.encodedId,
            "height": user.height,
            "weight": user.weight,
            "age": user.age,
            "sex": user.gender
        })
    });
    res.send(result);
});

app.listen(3000, () => {
    console.log('listening on port 3000!');
})
