// https://github.com/shelljs/shelljs
var shell = require('shelljs');
var path = require('path');
var defaults = require('lodash/defaults');
var base = require('./karma.base.config.js');

var BROWSERS = {
    'phantomjs': 'PhantomJS',
    'chrome': 'Chrome',
    'firefox': 'Firefox',
    'safari': 'Safari',
    'ie': 'IE'
};

var browsers = ['PhantomJS', 'Chrome', 'Firefox'];
if (process.env.npm_config_unit_browsers) {
    browsers = process.env.npm_config_unit_browsers.split(',');

    for (let i = 0, l = browsers.length; i < l; i++) {
        var browser = browsers[i].toLowerCase();
        browsers[i] = BROWSERS[browser];
    }
} else if (!process.env.npm_config_unit_browsers) {
    switch (process.platform) {
        case 'darwin':
            browsers.indexOf('Safari') < 0 && browsers.push('Safari');
            break;
        case 'win32':
            browsers.indexOf('IE') < 0 && browsers.push('IE');
            break;
    }
}

var tests = process.env.npm_config_unit_tests;
// NOTE: default test all files
tests = tests ? tests.split(',') : ['**/*'];

var testFiles = [];
for (let i = 0, l = tests.length; i < l; i++) {
    var test = path.join('specs', tests[i]);
    var dst = path.resolve(__dirname, base.basePath, test);

    if (shell.test('-d', dst)) {
        testFiles.push(path.join(test, '**/*.spec.js'));
    } else {
        testFiles.push(test + '.spec.js');
    }
}

console.log('Start test ' + testFiles + ' in ' + browsers + '\n');

module.exports = function (config) {
    config.set(defaults({
        browsers: browsers,
        reporters: ['progress'],
        files: base.files.concat(testFiles)
    }, base));
};
