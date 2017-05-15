// set some global Vue options
var scope = typeof window === 'undefined'
    ? global
    : window;

scope.process = {
    env: {
        NODE_ENV: 'testing'
    }
};

// NOTE: all test files are specified in build/karma.base.config.js
// they can not be specified twice
// Require all test files. All test files will be merged in one file
//var testsContext = require.context('.', true, /(\.spec|\.test)$/);
//testsContext.keys().forEach(testsContext);
