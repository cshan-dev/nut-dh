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

