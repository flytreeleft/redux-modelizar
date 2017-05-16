'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFunctionName = getFunctionName;
exports.getFunctionByName = getFunctionByName;
exports.registerFunction = registerFunction;
var gid = 1;
var fnMap = new Map();

function getFunctionName(fn) {
    var fnName = fnMap.get(fn);

    if (!fnName && fn !== Object) {
        registerFunction(fn.name, fn);

        fnName = fnMap.get(fn);
    }
    return fnName;
}

function getFunctionByName(fnName) {
    var fn = fnMap[fnName];

    if (!fn && fnName) {
        var actualName = fnName.replace(/@\d+$/g, '');
        try {
            fn = new Function('return ' + actualName + ';')();
        } catch (ignore) {}
    }
    return fn;
}

function registerFunction(name, fn) {
    if (fn instanceof Function && !fnMap.has(fn)) {
        name = name || 'Anonymous';
        if (fnMap[name] && fnMap[name] !== fn) {
            name = name + '@' + gid++;
        }

        fnMap[name] = fn;
        fnMap.set(fn, name);
    }
}