(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Test = function Test() {
    _classCallCheck(this, Test);
};

;
var a = 1,
    b = 2,
    foo = {
    a: a, b: b
},
    sum = function sum() {
    return a + b;
};

console.log(sum());
console.log("I'm syncing ES6!");

exports["default"] = a;

var data = [["row", "total_bill", "tip", "sex", "smoker", "day", "time", "size"], ["1", 16.99, 1.01, "Female", "No", "Sun", "Dinner", 2], ["2", 10.34, 1.66, "Male", "No", "Sun", "Dinner", 3], ["3", 21.01, 3.5, "Male", "No", "Sun", "Dinner", 3], ["4", 23.68, 3.31, "Male", "No", "Sun", "Dinner", 2]];

var utils = $.pivotUtilities;
var heatmap = utils.renderers["Heatmap"];
var sumOverSum = utils.aggregators["Sum over Sum"];

$("#output").pivotUI(data, {
    rows: ["sex", "smoker"],
    cols: ["day", "time"],
    aggregator: sumOverSum(["tip", "total_bill"]),
    renderer: heatmap
});
module.exports = exports["default"];

},{}]},{},[1]);
