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


//var user1 = $.get("/users/josh", (data) => {
//    console.log(data);
//});
//
//var user2 = $.get("/users/josh", (data) => {
//    console.log(data);
//});

function getAttribute(users, attribute, startDate, endDate, container) {
    return $.when(...(users.map((user) => {
        var path = `/users/${user}/${attribute}/${startDate}/${endDate}`;
        console.log(path)
        return $.get(path, (data) => {
            container.push(data)
        })
    })))
}

var userTable = [];

var distance = getAttribute(["josh", "eric"], "distance", "1", "1", userTable)
    .done(() => {
        var headers = ["id"];
        console.log(userTable);
        console.log(userTable[0][0]);
        for (var field of userTable[0]) {
            headers.push(field["dateTime"]);
        }
        var newTable = []
        newTable.push(headers);
		var id = 0;
        for (let person of userTable) {
            var row = []
            for (let record of person) {
                row.push(record["value"]);
            }
			row.unshift("person"+id++)
            newTable.push(row);
        }
		newTable[2][0] = 5;
        console.log(newTable);
        $("#pivot")
            .pivotUI(
                newTable, {});
    });


//console.log(distance);
//console.log(ConvertToCSV(distance[0]));

//var users = $.get("/users", (data) => {
//    console.log(data);
//});
//
//var users = $.get("/users/list/", (data) => {
//    console.log(data);
//});



//function addCol(data, name) {
//    data.forEach((row, i) => {
//        if (i == 0) {
//            data[i].push(name);
//        } else {
//  		  row.push(Math.floor(Math.random() * 1000));
//        }
//    });
//}

var data = [
     ["dateTime", "value"],
	 ["2015-02-23", 2188],
     ["2015-02-24", 2744],
     ["2015-02-25", 2162],
     ["2015-02-26", 2818],
     ["2015-02-27", 2163],
     ["2015-02-28", 2274],
     ["2015-03-01", 2269]
  ];
