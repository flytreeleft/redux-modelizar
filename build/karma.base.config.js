var path = require('path');
var merge = require('webpack-merge');

var baseWebpackConfig = require('./webpack.base.config');
var config = require('./config');

var __root__ = config.projectRoot;
var test = path.resolve(__root__, 'test');
// shared config for all unit tests
module.exports = {
    frameworks: ['mocha'],
    // The root path location that will be used to resolve
    // all relative paths defined in files and exclude.
    // If the basePath configuration is a relative path then
    // it will be resolved to the __dirname of the configuration file.
    basePath: test,
    // List of files/patterns to load in the browser:
    // **/*.js: All files with a "js" extension in all subdirectories
    // **/!(jquery).js: Same as previous, but excludes "jquery.js"
    // **/(foo|bar).js: In all subdirectories, all "foo.js" or "bar.js" files
    files: [
        'index.js'
    ],
    preprocessors: {
        '**/*.js': ['webpack']
    },
    webpack: merge(baseWebpackConfig, {
        // using eval will provide a good debug environment,
        // so that, every test script file will be separated.
        devtool: '#eval',
        devServer: {
            contentBase: './test',
            noInfo: true
        }
    }),
    webpackMiddleware: {
        noInfo: true
    },
    browserDisconnectTimeout: 5 * 60 * 1000,
    autoWatch: true,
    // Hostname to be used when capturing browsers.
    hostname: 'localhost',
    // The port where the web server will be listening.
    port: 9876,
    // The base url, where Karma runs:
    // All of Karma's urls get prefixed with the urlRoot.
    // This is helpful when using proxies,
    // as sometimes you might want to proxy a url that is already taken by Karma.
    urlRoot: '/',
    // Continuous Integration mode:
    // If true, Karma will start and capture all configured browsers,
    // run tests and then exit with an exit code of 0 or 1 depending on
    // whether all tests passed or any tests failed.
    // pass configuration by 'npm run e2e --unit-debug=true'
    singleRun: process.env.npm_config_unit_debug !== 'true'
};
