'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CLASS_SENTINEL = exports.FN_SENTINEL = undefined;
exports.hasFnSentinel = hasFnSentinel;
exports.hasClassSentinel = hasClassSentinel;
exports.extractFunctionFrom = extractFunctionFrom;

exports.default = function (obj) {
    if ((0, _immutableJs.isFunction)(obj)) {
        return _defineProperty({}, FN_SENTINEL, (0, _functions.getFunctionName)(obj));
    } else if ((0, _immutableJs.isObject)(obj)) {
        return Object.assign(_defineProperty({}, CLASS_SENTINEL, (0, _functions.getFunctionName)(obj.constructor)), obj);
    } else {
        return obj;
    }
};

var _immutableJs = require('immutable-js');

var _functions = require('./functions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FN_SENTINEL = exports.FN_SENTINEL = '[[ModelizarFunction]]';
var CLASS_SENTINEL = exports.CLASS_SENTINEL = '[[ModelizarClass]]';

function hasFnSentinel(obj) {
    return !!obj && (0, _immutableJs.hasOwn)(obj, FN_SENTINEL);
}

function hasClassSentinel(obj) {
    return !!obj && (0, _immutableJs.hasOwn)(obj, CLASS_SENTINEL);
}

function extractFunctionFrom(obj) {
    return !!obj && (0, _functions.getFunctionByName)(obj[FN_SENTINEL] || obj[CLASS_SENTINEL]);
}