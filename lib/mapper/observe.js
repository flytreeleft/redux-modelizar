'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PROP_OBSERVER = undefined;
exports.isObserved = isObserved;
exports.observeCheck = observeCheck;
exports.notifyDep = notifyDep;

var _immutableJs = require('immutable-js');

var PROP_OBSERVER = exports.PROP_OBSERVER = '__ob__';

function isObserved(obj) {
    return !(0, _immutableJs.isPrimitive)(obj) && (0, _immutableJs.hasOwn)(obj, PROP_OBSERVER);
}

function observeCheck(obj) {
    if (isObserved(obj)) {
        var ob = obj[PROP_OBSERVER];
        var items = Object.keys(obj).map(function (key) {
            return obj[key];
        });

        ob.observeArray(items);
    }
    return obj;
}

function notifyDep(obj) {
    if (isObserved(obj)) {
        observeCheck(obj);

        var ob = obj[PROP_OBSERVER];
        ob.dep.notify();
    }
    return obj;
}