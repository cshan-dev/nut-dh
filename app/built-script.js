(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var data = [["dateTime", "value"], ["2015-02-23", 2188], ["2015-02-24", 2744], ["2015-02-25", 2162], ["2015-02-26", 2818], ["2015-02-27", 2163], ["2015-02-28", 2274], ["2015-03-01", 2269]];

$("#pivot").pivotUI(data, {});

},{}]},{},[1]);
