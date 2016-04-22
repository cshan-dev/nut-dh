'use strict';

module.exports = function(karma) {
    karma.set({
        frameworks: ['jasmine', 'browserify'],
        files: ['https://code.jquery.com/jquery-2.2.1.js','https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.0.1/pivot.min.js','https://cdnjs.cloudflare.com/ajax/libs/pivottable/2.0.1/pivot.min.css','test/**/*tests.js'],
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
