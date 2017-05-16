'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMethodsUntilBase = getMethodsUntilBase;
function getMethodsUntilBase(cls) {
    var proto = cls.prototype;
    var reservedKeys = ['constructor', 'override', 'superclass', 'supr', 'extend'];
    var methods = {};

    while (proto && proto.constructor && proto.constructor !== Object) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
        Object.getOwnPropertyNames(proto).forEach(function (name) {
            var value = proto[name];
            if (reservedKeys.indexOf(name) < 0 && value instanceof Function && !methods[name]) {
                methods[name] = value;
            }
        });

        proto = Object.getPrototypeOf(proto);
    }
    return methods;
}