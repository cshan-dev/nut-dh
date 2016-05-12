var data = [
	["row","total_bill","tip","sex","smoker","day","time","size"],
	["1",16.99,1.01,"Female","No","Sun","Dinner",2],
	["2",10.34,1.66,"Male","No","Sun","Dinner",3],
	["3",21.01,3.5,"Male","No","Sun","Dinner",3],
	["4",23.68,3.31,"Male","No","Sun","Dinner",2],
];
/*
var utils = $.pivotUtilities;
var heatmap =  utils.renderers["Heatmap"];
var sumOverSum =  utils.aggregators["Sum over Sum"];

$("#output").pivotUI(
  data, {
    rows: ["sex", "smoker"],
    cols: ["day", "time"],
    aggregator: sumOverSum(["tip", "total_bill"]),
    renderer: heatmap
  });
*/
var accessToken = "";
var refreshToken = "";

var clientId = "227H8D";
var clientSecret = "bf884fa120f3142168a098257e34ea13";

function testcalls(){
	$.get('/getHeartRates')
}
document.getElementById("check").addEventListener("click",testcalls,false);

//[clientId]:[clientSecret] encoded with Base64
//used in Authoriation header
var clientEncoded = "MjI3SDhEOmJmODg0ZmExMjBmMzE0MjE2OGEwOTgyNTdlMzRlYTEz";

//Not used by Mark in current build
export var getAccessToken = function() {
	console.log("getting access token");
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status == 200){
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
	var params = "client_id=" + clientId + "&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fpost%5Ftokens&code=" + authCode;
	xhr.send(params);
	return accessToken;
};

//Not used by Mark in current build
//gets users steps dating back 7 days from today
var getSteps = function(){
	console.log("getting activites");
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status == 200){
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

$('#getHeart').click(function(){
	var start = "2016-04-16"//$('#start_date').val();
	var end = "2016-04-20"//$('#end_date').val();
	$.get("/getHeart/" + start + "/" + end, function(data){
		console.log(data);
	});
});

$('#getSteps').click(function(){
	var start = "2016-04-16"//$('#start_date').val();
	var end = "2016-04-20"//$('#end_date').val();
	$.get("/getSteps/" + start + "/" + end, function(data){
		console.log(data);
	});
});

$('#getData').click(function(){
	var start = "2016-04-20"//$('#start_date').val();
	var end = "2016-04-20"//$('#end_date').val();
	var interval = "15min"//$('#interval').val();
	console.log("getting data");
	$.get(`/getAllData/${start}/${end}/${interval}`,function(data){// + start + "/" + end + "/" + interval, function(data){
		console.log(data);
	});
});

export var testTest = function(){
	return 0;
}

