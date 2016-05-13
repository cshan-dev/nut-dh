var server = require('../../backend/server');
console.log(server);
var assert = require('assert'),
	http = require('http');
describe('/', function() {
	it('should return 200', function (done) {
			http.get('http://localhost:3000', function(res) {
				assert.equal(200, res.statusCode);
				done();
			});
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
		var result = server.dataTransform('2016-05-12');
		assert(result !== null);
	});
});

describe('get activity data', function(){
	it('shoudnt be null', function(){
		var result = server.getActivityData('activities/calories', new Date('2016-05-12'), new Date('2016-05-13'), '1min');
		assert(result !== null);
	});
});