var data = [
	["row","total_bill","tip","sex","smoker","day","time","size"],
	["1",16.99,1.01,"Female","No","Sun","Dinner",2],
	["2",10.34,1.66,"Male","No","Sun","Dinner",3],
	["3",21.01,3.5,"Male","No","Sun","Dinner",3],
	["4",23.68,3.31,"Male","No","Sun","Dinner",2],
];

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
