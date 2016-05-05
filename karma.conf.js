'use strict';
var istanbul = require('browserify-istanbul');

module.exports = function(karma) {
    karma.set({
        frameworks: ['jasmine', 'browserify'],
        files: ['https://code.jquery.com/jquery-2.2.1.js','https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.0.1/pivot.min.js','https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.0.1/pivot.min.css','test/**/*tests.js'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'test/**/*tests.js': ['browserify', 'coverage'],
        },
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatch: false,
        browserify: {
            debug: true,
            transform: [['babelify'],
					istanbul({ignore: ['test/**', '**/node_modules/**']})]
        },
		babelPreprocessor: {
			options: {
				sourceMap: 'inline'
			},
			sourceFileName: function(file) {
				return file.originalPath;
			}
		},
		coverageReporter: {
			reporters: [{ type: 'text-summary'} ],
			dir: "coverage/"
		}
    });
}
