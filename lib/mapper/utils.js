'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reflectProto = reflectProto;
exports.isBoundState = isBoundState;
exports.getBoundMapper = getBoundMapper;

var _immutableJs = require('immutable-js');

var _class = require('../utils/class');

var _actions = require('../modelizar/actions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PROP_STATE_MAPPER = '[[ModelizarMapper]]';
function reflectProto(obj, mapper) {
    var cls = obj.constructor;
    var methods = {};

    if ((0, _immutableJs.isArray)(obj)) {
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
            var original = obj[method];
            methods[method] = function batchMutate() {
                var _this = this;

                var mapper = getBoundMapper(this);
                var store = mapper.store;
                var state = mapper.state;

                var args = [].concat(Array.prototype.slice.call(arguments));
                return store.doBatch(function () {
                    var result = original.apply(_this, args);
                    var newState = state[method].apply(state, args);
                    store.dispatch((0, _actions.mutateState)(state, [], newState));

                    return result;
                }, {
                    method: 'Array$' + method
                });
            };
        });
    } else if ((0, _immutableJs.isDate)(obj)) {
        Object.getOwnPropertyNames(Date.prototype).filter(function (method) {
            return method.startsWith('set');
        }).forEach(function (method) {
            var original = obj[method];
            methods[method] = function batchMutate() {
                var _this2 = this;

                var mapper = getBoundMapper(this);
                var store = mapper.store;
                var state = mapper.state;

                var args = [].concat(Array.prototype.slice.call(arguments));
                return store.doBatch(function () {
                    var result = original.apply(_this2, args);
                    store.dispatch((0, _actions.mutateState)(state, [], _this2));

                    return result;
                }, {
                    method: 'Date' + method
                });
            };
        });
    } else {
        methods = (0, _class.getMethodsUntilBase)(cls);
        Object.keys(methods).forEach(function (method) {
            var original = obj[method];
            methods[method] = function batchMutate() {
                var _this3 = this;

                var mapper = getBoundMapper(this);
                var store = mapper.store;
                var args = [].concat(Array.prototype.slice.call(arguments));

                return store.doBatch(function () {
                    return original.apply(_this3, args);
                }, {
                    method: cls.name + '$' + method
                });
            };
        });
        Object.assign(methods, {
            /**
             * @param {String[]/String} prop e.g. `['a', 'b', '1']` or `'a.b[1]'`
             * @param {*} value
             */
            $set: function $set(prop, value) {
                // Trigger mapper.update() to add new property.
                mapper.store.dispatch((0, _actions.mutateState)(obj, prop, value));
            },
            /**
             * @param {String[]/String} prop e.g. `['a', 'b', '1']` or `'a.b[1]'`
             */
            $remove: function $remove(prop) {
                // Trigger mapper.update() to remove property.
                mapper.store.dispatch((0, _actions.removeSubState)(obj, prop));
            }
        });
    }

    Object.assign(methods, _defineProperty({}, PROP_STATE_MAPPER, mapper));

    var proto = Object.create(Object.getPrototypeOf(obj), (0, _immutableJs.createNE)(methods));
    Object.setPrototypeOf(obj, proto);

    return obj;
}

function isBoundState(obj) {
    return !!getBoundMapper(obj);
}

function getBoundMapper(obj) {
    return !(0, _immutableJs.isPrimitive)(obj) ? obj[PROP_STATE_MAPPER] : null;
}