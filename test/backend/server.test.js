var server = require('../../backend/server');
console.log(server);
var assert = require('assert'),
	http = require('http');
	
	
describe('/', function() {
	it('should return 200', function (done) {
			http.get('http://localhost:22205', function(res) {
				assert.equal(200, res.statusCode);
				done();
			});
	});
});

describe('/getData', function() {
	it('should return 200', function () {
			var result = http.get('http://localhost:22205/getData/:2016-05-12/:2016-05-12/:1min', function(req, res) {
				assert(result !== null);
				//done();
			});
	});
});

describe('/getSteps', function() {
	it('should return 200', function () {
			var result = http.get('http://localhost:22205/getSteps/:2016-05-12/:2016-05-12', function(req, res) {
				assert(result !== null);
				//done();
			});
	});
});

describe('/getHeart', function() {
	it('should return 200', function () {
			var result = http.get('http://localhost:22205/getHeart/:2016-05-12/:2016-05-12', function(req, res) {
				assert(result !== null);
				//done();
			});
	});
});

describe('/post_tokens', function() {
	it('should return 200', function () {
			var result = http.get('http://localhost:22205/post_tokens', function(req, res) {
				assert(result !== null);
				//done();
			});
	});
});

describe('/getHeartRates', function() {
	it('should return 200', function () {
			var result = http.get('http://localhost:22205/getHeartRates', function(req, res) {
				assert(result !== null);
				//done();
			});
	});
});

describe('/getAllData', function() {
	it('should return 200', function () {
			var result = http.get('http://localhost:22205/getAllData/:2016-05-12/:2016-05-12/:1min', function(req, res) {
				assert(result !== null);
				//done();
			});
	});
});




describe('getUTC', function(){
	it('shoudnt be null', function(){
		var result = server.getUTC(new Date('2016-05-12'));
		assert(result !== null);
	});
});

describe('loop Url', function(){
	it('shoudnt be null', function(){
		var result = server.loopUrls(0, new Date('2016-05-12'), new Date('2016-05-13'), '1min', null);
		assert(result !== null);
	});
});

describe('format date', function(){
	it('shoudnt be null', function(){
		var result = server.formatDate(new Date('2016-05-12'));
		assert(result !== null);
	});
});

describe('data transform', function(){
	it('shoudnt be null', function(){
		var result = server.dataTransform(0, new Date('2016-05-12'), new Date('2016-05-13'), '1min', true);
		assert(result !== null);
	});
});

describe('get activity data', function(){
	it('shoudnt be null', function(){
		var result = server.getActivityData('activities/calories', new Date('2016-05-12'), new Date('2016-05-13'), '1min');
		assert(result !== null);
	});
});

describe('format date/time', function(){
	it('shoudnt be null', function(){
		var result = server.formatDateTime(new Date('2016-05-12'));
		assert(result !== null);
	});
});