'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var args = [].concat(Array.prototype.slice.call(arguments));

    if (args.length === 1 && (0, _immutableJs.isArray)(args[0])) {
        args = args[0];
    }

    return _redux.applyMiddleware.apply(undefined, _toConsumableArray(args));
};

var _redux = require('redux');

var _immutableJs = require('immutable-js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Override `applyMiddleware` of `redux` to support to pass array argument.
 */


module.exports = exports['default'];