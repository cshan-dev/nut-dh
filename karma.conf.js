'use strict';

module.exports = function(karma) {
    karma.set({
        frameworks: ['jasmine', 'browserify'],
        files: ['test/**/*tests.js'],
        reports: ['dots'],
        preprocessors: {
            'test/**/*tests.js': ['browserify']
        },
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatch: false,
        browserify: {
            debug: true,
            transform: ['babelify']
        }
    });
}
