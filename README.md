# nut-dh

## Getting Started

First, you need to have [Node.js](https://nodejs.org/en/download/) installed.

In this project directory, run

	npm install

This will install all of the dependencies for the project's Grunt tasks. Next, run

	grunt

If everything installed correctly, Grunt should start running. After a few seconds, it should open the project's index page in your browser.

## Usage

In general, just run `grunt` when developing. Keep it running and it while watch for code changes (on file save), and automatically bundle the ES6 modules in `src/` and place a single `built-script.js` in `app/`. Then the browser page should automatically refresh to show your changes.

To run tests, run `grunt test`. This will first check your code's style, potentially fixing some small issues or warning you about others. Next it will run any tests written in `tests/`.

## Main Packages

 * [Browserify](http://browserify.org/) + [babelify](https://github.com/babel/babelify): Transforms and bundles ES6 code into ES5.
 * [Browsersync](https://www.browsersync.io/): Performs the automatic browser reloads.
 * [Eslint](http://eslint.org/): Linter for checking/fixing code style.
 * [Karma](https://karma-runner.github.io/0.13/index.html) + [Jasmine](http://jasmine.github.io/2.0/introduction.html) + [PhantomJS](http://phantomjs.org/): Karma runs your Jasmine tests in PhantomJS, a headless browser. For the purposes of this project, Jasmine's documentation will be most helpful.
 * [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch): Runs tasks on file changes.
