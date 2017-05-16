/*!
 * Redux modelizar v0.1.0
 * (c) 2017-2017 flytreeleft <flytreeleft@126.com>
 * Released under the license of Apache-2.0.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 74);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.guid = exports.isEnumerable = exports.isWritable = exports.isConfigurable = exports.hasOwn = exports.isBoolean = exports.isDate = exports.isPrimitive = exports.isFunction = exports.isPlainObject = exports.isObject = exports.isArray = exports.valueOf = exports.createNE = exports.getNodeByPath = exports.extractPath = undefined;

var _extractPath = __webpack_require__(19);

Object.defineProperty(exports, 'extractPath', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_extractPath).default;
  }
});

var _getNodeByPath = __webpack_require__(10);

Object.defineProperty(exports, 'getNodeByPath', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getNodeByPath).default;
  }
});

var _createNE = __webpack_require__(20);

Object.defineProperty(exports, 'createNE', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createNE).default;
  }
});

var _valueOf = __webpack_require__(27);

Object.defineProperty(exports, 'valueOf', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_valueOf).default;
  }
});

var _isArray = __webpack_require__(2);

Object.defineProperty(exports, 'isArray', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isArray).default;
  }
});

var _isObject = __webpack_require__(1);

Object.defineProperty(exports, 'isObject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isObject).default;
  }
});

var _isPlainObject = __webpack_require__(25);

Object.defineProperty(exports, 'isPlainObject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isPlainObject).default;
  }
});

var _isFunction = __webpack_require__(7);

Object.defineProperty(exports, 'isFunction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isFunction).default;
  }
});

var _isPrimitive = __webpack_require__(26);

Object.defineProperty(exports, 'isPrimitive', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isPrimitive).default;
  }
});

var _isDate = __webpack_require__(23);

Object.defineProperty(exports, 'isDate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isDate).default;
  }
});

var _isBoolean = __webpack_require__(22);

Object.defineProperty(exports, 'isBoolean', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isBoolean).default;
  }
});

var _hasOwn = __webpack_require__(21);

Object.defineProperty(exports, 'hasOwn', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hasOwn).default;
  }
});

var _isConfigurable = __webpack_require__(52);

Object.defineProperty(exports, 'isConfigurable', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isConfigurable).default;
  }
});

var _isWritable = __webpack_require__(55);

Object.defineProperty(exports, 'isWritable', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isWritable).default;
  }
});

var _isEnumerable = __webpack_require__(24);

Object.defineProperty(exports, 'isEnumerable', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isEnumerable).default;
  }
});

var _guid = __webpack_require__(6);

Object.defineProperty(exports, 'guid', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_guid).default;
  }
});

var _Immutable = __webpack_require__(48);

var _Immutable2 = _interopRequireDefault(_Immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Immutable2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Check if the `obj` is an object or not.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * NOTE: Passing `null` and `undefined` will return `false`.
                                                                                                                                                                                                                                                                               */


exports.default = function (obj) {
  return !!obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
};

module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var isArray = Array.isArray;

exports.default = isArray;
module.exports = exports["default"];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BATCH_MUTATE = exports.REMOVE_SUB_STATE = exports.MUTATE_STATE = exports.REDUX_MODELIZAR_STATE = undefined;
exports.mutateState = mutateState;
exports.removeSubState = removeSubState;
exports.batchMutateState = batchMutateState;

var _immutableJs = __webpack_require__(0);

var _namespace = __webpack_require__(8);

var REDUX_MODELIZAR_STATE = exports.REDUX_MODELIZAR_STATE = _namespace.REDUX_MODELIZAR + '/state';
var MUTATE_STATE = exports.MUTATE_STATE = REDUX_MODELIZAR_STATE + '/MUTATE_STATE';
var REMOVE_SUB_STATE = exports.REMOVE_SUB_STATE = REDUX_MODELIZAR_STATE + '/REMOVE_SUB_STATE';
var BATCH_MUTATE = exports.BATCH_MUTATE = REDUX_MODELIZAR_STATE + '/BATCH_MUTATE';

/**
 * Add value to new property or set new value to existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]/String} key Path array or string which is split by `.`.
 * @param {*} value
 */
function mutateState(state, key, value) {
    return {
        type: MUTATE_STATE,
        $target: (0, _immutableJs.isPrimitive)(state) ? state : (0, _immutableJs.guid)(state),
        key: key,
        value: value
    };
}

/**
 * Remove the existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]/String} key Path array or string which is split by `.`.
 */
function removeSubState(state, key) {
    return {
        type: REMOVE_SUB_STATE,
        $target: (0, _immutableJs.isPrimitive)(state) ? state : (0, _immutableJs.guid)(state),
        key: key
    };
}

function batchMutateState(actions, meta) {
    return {
        type: BATCH_MUTATE,
        meta: meta,
        actions: actions
    };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UNDOABLE_END_BATCH = exports.UNDOABLE_START_BATCH = exports.UNDOABLE_CLEAR = exports.UNDOABLE_REDO = exports.UNDOABLE_UNDO = exports.UNDOABLE_INIT = exports.REDUX_MODELIZAR_UNDOABLE = undefined;
exports.init = init;
exports.undo = undo;
exports.redo = redo;
exports.clear = clear;
exports.startBatch = startBatch;
exports.endBatch = endBatch;

var _namespace = __webpack_require__(8);

var REDUX_MODELIZAR_UNDOABLE = exports.REDUX_MODELIZAR_UNDOABLE = _namespace.REDUX_MODELIZAR + '/undoable';
var UNDOABLE_INIT = exports.UNDOABLE_INIT = REDUX_MODELIZAR_UNDOABLE + '/INIT';
var UNDOABLE_UNDO = exports.UNDOABLE_UNDO = REDUX_MODELIZAR_UNDOABLE + '/UNDO';
var UNDOABLE_REDO = exports.UNDOABLE_REDO = REDUX_MODELIZAR_UNDOABLE + '/REDO';
var UNDOABLE_CLEAR = exports.UNDOABLE_CLEAR = REDUX_MODELIZAR_UNDOABLE + '/CLEAR';
var UNDOABLE_START_BATCH = exports.UNDOABLE_START_BATCH = REDUX_MODELIZAR_UNDOABLE + '/START_BATCH';
var UNDOABLE_END_BATCH = exports.UNDOABLE_END_BATCH = REDUX_MODELIZAR_UNDOABLE + '/END_BATCH';

function init(target) {
    return {
        type: UNDOABLE_INIT,
        $target: target
    };
}

function undo(target, count) {
    return {
        type: UNDOABLE_UNDO,
        $target: target,
        count: count
    };
}

function redo(target, count) {
    return {
        type: UNDOABLE_REDO,
        $target: target,
        count: count
    };
}

function clear(target) {
    return {
        type: UNDOABLE_CLEAR,
        $target: target
    };
}

function startBatch(target) {
    return {
        type: UNDOABLE_START_BATCH,
        $target: target
    };
}

function endBatch(target) {
    return {
        type: UNDOABLE_END_BATCH,
        $target: target
    };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHistory = getHistory;
exports.init = init;
exports.insert = insert;
exports.undo = undo;
exports.redo = redo;
exports.clear = clear;
exports.startBatch = startBatch;
exports.endBatch = endBatch;

var _immutableJs = __webpack_require__(0);

var _immutableJs2 = _interopRequireDefault(_immutableJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deepEqualState(oldState, newState) {
    // NOTE: The reference will be changed
    // if some mutations happened in state,
    // so checking if reference is equal
    // or not is just enough.
    return oldState === newState;
}

function shallowEqualState(oldState, newState) {
    var excludes = ['valueOf'];
    var oldKeys = oldState.keys().filter(function (key) {
        return excludes.indexOf(key) >= 0;
    });
    var newKeys = newState.keys().filter(function (key) {
        return excludes.indexOf(key) >= 0;
    });
    if (oldKeys.length !== newKeys.length) {
        return false;
    }

    var equal = true;
    oldState.forEach(function (oldS, path) {
        if (excludes.indexOf(path) >= 0) {
            return;
        }

        var newS = newState.get([path]);
        if (oldS && newS && oldS.isArray && newS.isArray && oldS.isArray() && newS.isArray() && oldS.size() === newS.size()) {
            oldS.forEach(function (s, path) {
                equal = _immutableJs2.default.same(s, newS.get([path]));
                return equal;
            });
        } else {
            equal = _immutableJs2.default.same(oldS, newS);
        }
        return equal;
    });

    return equal;
}

/**
 * When following condition is true, applying the value of new state:
 * - The old state doesn't contains the value that exists in new state;
 * - The old contains the value which doesn't exist in new state;
 * - The same property but different value (except Object, Array) or value type;
 *
 * Applying the value of old state:
 * - The same property and value type are Array or Immutable.List,
 *   keep the element which `is` the value of old state;
 * - The same property and value tye are Object or Immutable.Map,
 *   if the new one `is` the old one, return the old one;
 */
function shallowMerge(oldState, newState) {
    var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (!_immutableJs2.default.isInstance(oldState) || !_immutableJs2.default.isInstance(newState) || _immutableJs2.default.same(oldState, newState)) {
        return newState;
    }

    if (oldState.isArray() && newState.isArray()) {
        return newState.map(function (state, path) {
            // Find exist value by guid
            var exist = oldState.get(oldState.path(state.valueOf()));

            return exist.valueOf() !== undefined ? exist : state;
        });
    } else {
        return deep ? newState.map(function (state, path) {
            var old = oldState.get([path]);

            if (_immutableJs2.default.same(old, state)) {
                return old;
            } else {
                return shallowMerge(old, state, false);
            }
        }) : oldState;
    }
}

function deepMerge(oldState, newState) {
    if (oldState === newState) {
        return newState;
    }

    return newState.remove('valueOf');
}

function undoableState(state, options) {
    return state;
    // if (!options.independent) {
    //     return state;
    // }
    //
    // var newState = state.set('valueOf', () => {
    //     var target = guid(state.valueOf());
    //     var present = histories[target].present;
    //     return present === newState ? state.valueOf() : present.valueOf();
    // });
    // return newState;
}

// `{target: history}` map
// TODO Record `action.type`
var histories = {};

// WARNING: Never change the parameter which is an Object!

/**
 * Get history record copies of `target`.
 */
function getHistory(target) {
    var id = (0, _immutableJs.isPrimitive)(target) ? target : (0, _immutableJs.guid)(target);
    var history = histories[id];

    return history ? {
        timestamp: history.timestamp,
        undoes: history.past.concat(),
        redoes: history.future.concat(),
        batching: history.batching
    } : null;
}

/**
 * @param {Object} state The state of model.
 */
function init(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    // NOTE: The cycle reference should not become a histories owner.
    var target = (0, _immutableJs.guid)(state.valueOf());
    if (!target || histories[target]) {
        return state;
    }

    var present = undoableState(state, options);
    histories[target] = {
        timestamp: Date.now(),
        future: [],
        present: present,
        past: [],
        batching: false,
        options: options
    };

    return present;
}

/**
 * @param {Object} state The state of model.
 */
function insert(state, action) {
    var target = (0, _immutableJs.guid)(state.valueOf());
    if (!target || !histories[target]) {
        return state;
    }

    var history = histories[target];
    var batching = history.batching;
    if (batching) {
        return state;
    }

    var options = history.options;
    var present = history.present;
    var hist = {
        timestamp: history.timestamp,
        future: history.future.concat(),
        present: present,
        past: history.past.concat()
    };
    if (options.filter && !options.filter(action, state, hist)) {
        return state;
    }

    var equals = options.deep ? deepEqualState : shallowEqualState;
    if (equals(present, state)) {
        return state;
    }

    var past = history.past;
    var limit = options.limit;
    if (limit !== 0) {
        past.push(present);
        if (limit > 0 && past.length > limit) {
            history.past = past.slice(past.length - limit);
        }
    }

    var newState = undoableState(state, options);
    history.present = present = newState;
    history.future = [];
    history.timestamp = Date.now();

    return present;
}

function undo(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var target = (0, _immutableJs.isPrimitive)(action.$target) ? action.$target : (0, _immutableJs.guid)(action.$target);
    if (!target || !histories[target] || target !== (0, _immutableJs.guid)(state)) {
        return state;
    }

    var history = histories[target];
    var options = history.options;
    var present = history.present;
    var future = history.future;
    var past = history.past;
    var count = Math.max(1, action.count || 1);
    var index = past.length - Math.min(count, past.length);
    var undoes = past.slice(index).concat([present]);

    history.present = present = undoes.shift();
    history.future = undoes.concat(future);
    history.past = index > 0 ? past.slice(0, index) : [];
    history.timestamp = Date.now();

    var merge = options.deep ? deepMerge : shallowMerge;
    return merge(state, present);
}

function redo(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var target = (0, _immutableJs.isPrimitive)(action.$target) ? action.$target : (0, _immutableJs.guid)(action.$target);
    if (!target || !histories[target] || target !== (0, _immutableJs.guid)(state)) {
        return state;
    }

    var history = histories[target];
    var options = history.options;
    var present = history.present;
    var past = history.past;
    var future = history.future;
    var count = Math.max(1, action.count || 1);
    var index = Math.min(count, future.length);
    var redoes = [present].concat(future.slice(0, index));

    history.present = present = redoes.pop();
    history.past = past.concat(redoes);
    history.future = index < future.length ? future.slice(index) : [];
    history.timestamp = Date.now();

    var merge = options.deep ? deepMerge : shallowMerge;
    return merge(state, present);
}

function clear(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var target = (0, _immutableJs.isPrimitive)(action.$target) ? action.$target : (0, _immutableJs.guid)(action.$target);
    if (!target || !histories[target] || target !== (0, _immutableJs.guid)(state)) {
        return state;
    }

    var history = histories[target];
    history.past = [];
    history.future = [];

    return state;
}

function startBatch(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var target = (0, _immutableJs.isPrimitive)(action.$target) ? action.$target : (0, _immutableJs.guid)(action.$target);
    if (!target || !histories[target] || target !== (0, _immutableJs.guid)(state)) {
        return state;
    }

    var history = histories[target];
    if (history.batching) {
        return state;
    } else {
        history.batching = true;
        return state;
    }
}

function endBatch(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var target = (0, _immutableJs.isPrimitive)(action.$target) ? action.$target : (0, _immutableJs.guid)(action.$target);
    if (!target || !histories[target] || target !== (0, _immutableJs.guid)(state)) {
        return state;
    }

    var history = histories[target];
    if (history.batching) {
        history.batching = false;
        // Add the final state to history
        return insert(state, action);
    } else {
        return state;
    }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GUID_SENTINEL = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (obj, id) {
    var enumerable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!canBind(obj)) {
        return null;
    }
    if ((0, _isBoolean2.default)(id)) {
        enumerable = id;
    }

    var value = (0, _valueOf2.default)(obj);
    var isBinding = !!id;
    var boundId = obj[GUID_SENTINEL] || canBind(value) && value[GUID_SENTINEL];

    if (!boundId || isBinding) {
        bind(obj, isBinding ? id : boundId = next(), enumerable);
    }
    return isBinding ? obj : boundId;
};

var _valueOf = __webpack_require__(27);

var _valueOf2 = _interopRequireDefault(_valueOf);

var _isBoolean = __webpack_require__(22);

var _isBoolean2 = _interopRequireDefault(_isBoolean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function next() {
    var uuid = __webpack_require__(72);
    return uuid().replace(/-/g, '');
}

var GUID_SENTINEL = exports.GUID_SENTINEL = '[[GlobalUniqueID]]';
function bind(obj, id, enumerable) {
    Object.defineProperty(obj, GUID_SENTINEL, {
        writable: false,
        configurable: true,
        enumerable: enumerable,
        value: id
    });

    return obj;
}

function canBind(obj) {
    return !!obj && ['function', 'object'].indexOf(typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) >= 0;
}

/**
 * Get or bind a global unique id.
 *
 * @param {Object} obj
 * @param {String} [id] A custom id which will be bound to `obj`.
 * @param {Boolean} [enumerable=false] Bind id as enumerable property or not?
 * @return {String/Object} Return `obj` if the parameter `id` was specified,
 *          otherwise, return the id bound to `obj`.
 */

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj) {
    return obj instanceof Function;
};

module.exports = exports["default"];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var REDUX_MODELIZAR = exports.REDUX_MODELIZAR = '@@redux-modelizar';

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * NOTE: Ignore Function and primitive node.
 */


exports.default = function (node) {
    if (!(0, _isObject2.default)(node)) {
        return node;
    }

    var nodeId = (0, _guid2.default)(node);
    var newNode;
    if ((0, _isArray2.default)(node)) {
        newNode = node.concat();
    } else if (node.isArray && node.isArray()) {
        // Immutable array-like object
        newNode = Array.prototype.slice.call(node);
    } else {
        newNode = _extends({}, node);
    }
    (0, _guid2.default)(newNode, nodeId);

    return newNode;
};

var _isObject = __webpack_require__(1);

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = __webpack_require__(2);

var _isArray2 = _interopRequireDefault(_isArray);

var _guid = __webpack_require__(6);

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (root, path) {
    if (!path) {
        return undefined;
    }

    var node = root;
    for (var i = 0; i < path.length && (0, _isObject2.default)(node); i++) {
        var key = path[i];
        node = node[key];
    }
    return i >= path.length ? node : undefined;
};

var _isObject = __webpack_require__(1);

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * Get target node object from `root` following the `path`.
 *
 * @param {*} root The root node of object tree.
 * @param {Array} path The path of target node.
 * @return {*}
 */

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.default = isNullOrUndefined;
function isNull(obj) {
    return obj === null;
}

function isUndefined(obj) {
    return typeof obj === 'undefined';
}

function isNullOrUndefined(obj) {
    return isNull(obj) || isUndefined(obj);
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (__webpack_require__.i({"VERSION":"0.1.0"}).NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_warning__ = __webpack_require__(32);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createStore", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combineReducers", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bindActionCreators", function() { return __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "applyMiddleware", function() { return __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return __WEBPACK_IMPORTED_MODULE_4__compose__["a"]; });







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (__webpack_require__.i({"VERSION":"0.1.0"}).NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utils_warning__["a" /* default */])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}



/***/ }),
/* 14 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bindHistory;

var _immutableJs = __webpack_require__(0);

var _reducer = __webpack_require__(5);

var _actions = __webpack_require__(4);

/**
 * Bind `history` to object.
 * The object can operate historic data by `history`.
 *
 * The properties of `history`:
 * ```
 * - [Number] timestamp: The latest mutation occurred time.
 * - [Function] undo: `([Number]: count = 1) => ()`, undo the specified number(>=1) of actions.
 * - [Function] redo: `([Number]: count = 1) => ()`, redo the specified number(>=1) of actions.
 * - [Function] clear: `() => ()`, clear all actions.
 * - [Function] undoable: `() => Boolean`, can be undo or not?
 * - [Function] redoable: `() => Boolean`, can be redo or not?
 * - [Function] undoes: `() => Array`, return the undo historic records.
 * - [Function] redoes: `() => Array`, return the redo historic records.
 * - [Function] startBatch: `() => ()`, start history batch recording.
 * - [Function] endBatch: `() => ()`, stop history batch recording.
 * ```
 */
function bindHistory(store, obj) {
    var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!(0, _immutableJs.isObject)(obj) || obj.history) {
        return obj;
    }

    var getLazyHistory = function getLazyHistory(obj) {
        var history = (0, _reducer.getHistory)(obj);
        if (!history) {
            store.dispatch((0, _actions.init)(obj));
            history = (0, _reducer.getHistory)(obj);
        }

        return history ? history : {
            timestamp: 0,
            undoes: [],
            redoes: [],
            batching: false
        };
    };

    // TODO 确保history是响应式的
    var history = {
        undo: function undo(count) {
            return store.dispatch((0, _actions.undo)(obj, count));
        },
        redo: function redo(count) {
            return store.dispatch((0, _actions.redo)(obj, count));
        },
        clear: function clear() {
            return store.dispatch((0, _actions.clear)(obj));
        },
        undoable: function undoable() {
            return getLazyHistory(obj).undoes.length > 0;
        },
        redoable: function redoable() {
            return getLazyHistory(obj).redoes.length > 0;
        },
        undoes: function undoes() {
            return getLazyHistory(obj).undoes;
        },
        redoes: function redoes() {
            return getLazyHistory(obj).redoes;
        },
        startBatch: function startBatch() {
            return store.dispatch((0, _actions.startBatch)(obj));
        },
        endBatch: function endBatch() {
            return store.dispatch((0, _actions.endBatch)(obj));
        }
    };
    Object.defineProperties(history, {
        timestamp: {
            get: function get() {
                return getLazyHistory(obj).timestamp;
            }
        }
    });

    Object.defineProperties(obj, {
        history: {
            writable: false,
            enumerable: false,
            configurable: true,
            value: Object.freeze(history)
        }
    });
    immediate && getLazyHistory(obj);

    return obj;
}
module.exports = exports['default'];

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undoable;

var _actions = __webpack_require__(4);

var _reducer = __webpack_require__(5);

/**
 * Reference:
 * - [Redux undo](https://github.com/omnidan/redux-undo);
 */
function undoable(reducer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options = Object.assign({}, {
        // Only add to history if return `true`
        filter: function filter(action, currentState, previousHistory) {
            return true;
        },
        debug: false,
        // Whether or not add all deep state tree to history,
        // if `false`, only the shallow state will be add to history
        deep: true,
        // Set to a number to turn on a limit for the history:
        // * -1: unlimited;
        // * 0: no history;
        // * [1,): limit number;
        limit: -1,
        // Keep the `history` to be redo/undo independently,
        // the top state's history will not change
        // the independent history's present state.
        // NOTE: The top history should always keep `independent` to `false`.
        independent: false
    }, options);

    return function (state) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        switch (action.type) {
            case _actions.UNDOABLE_INIT:
                // NOTE: Dispatch `UNDOABLE_INIT` when binding history to object.
                // see `./bindHistory.js`.
                return (0, _reducer.init)(state, action, options);
            case _actions.UNDOABLE_UNDO:
                return (0, _reducer.undo)(state, action);
            case _actions.UNDOABLE_REDO:
                return (0, _reducer.redo)(state, action);
            case _actions.UNDOABLE_CLEAR:
                return (0, _reducer.clear)(state, action);
            case _actions.UNDOABLE_START_BATCH:
                return (0, _reducer.startBatch)(state, action);
            case _actions.UNDOABLE_END_BATCH:
                return (0, _reducer.endBatch)(state, action);
            default:
                // 注意以下情况：
                // - 状态变更（部分/全部）：传入的state和reducer返回的state
                //   必然为完整的model state，故，action无需指定target；
                // - 多级undoable：insert中会检查状态是否真的发生变化，
                //   在下级发生变化且`deep==true`时，上级也需同样记录变化；
                var newState = reducer(state, action);
                return (0, _reducer.insert)(newState, action);
        }
    };
}
module.exports = exports['default'];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _immutableJs = __webpack_require__(0);

var _functions = __webpack_require__(17);

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

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (path) {
    if ((0, _isNullOrUndefined2.default)(path)) {
        return null;
    }

    if ((0, _isString2.default)(path)) {
        return path.replace(/\[([^\[\]]+)\]/g, '.$1').replace(/(^\.+)|(\.+$)/g, '').split(/\./);
    } else if ((0, _isArray2.default)(path)) {
        return path;
    } else {
        throw new Error('Expected parameter "path" is' + (' an Array or String. But received \'' + path + '\'.'));
    }
};

var _isArray = __webpack_require__(2);

var _isArray2 = _interopRequireDefault(_isArray);

var _isString = __webpack_require__(54);

var _isString2 = _interopRequireDefault(_isString);

var _isNullOrUndefined = __webpack_require__(11);

var _isNullOrUndefined2 = _interopRequireDefault(_isNullOrUndefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * @return {Array/null} Return `null` if `path` is null or undefined.
 */

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createNE;
/**
 * Creates non-enumerable property descriptors, to be used by Object.create.
 *
 * Source: https://github.com/arqex/freezer/blob/master/src/utils.js#L58
 *
 * @param  {Object} attrs Properties to create descriptors
 * @return {Object} A hash with the descriptors.
 */
function createNE(attrs) {
    var ne = {};

    Object.keys(attrs).forEach(function (attr) {
        ne[attr] = {
            writable: true,
            configurable: true,
            enumerable: false,
            value: attrs[attr]
        };
    });

    return ne;
}
module.exports = exports["default"];

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (obj, prop) {
    return !!obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && hasOwnProperty.call(obj, prop);
};

var hasOwnProperty = Object.prototype.hasOwnProperty;
module.exports = exports['default'];

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj) {
    return obj instanceof Boolean || obj === true || obj === false;
};

module.exports = exports["default"];

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj) {
    return obj instanceof Date;
};

module.exports = exports["default"];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj, prop) {
    if (!obj || !prop || !(prop in obj)) {
        return true;
    }

    var des = Object.getOwnPropertyDescriptor(obj, prop);
    return !des || des.enumerable !== false;
};

module.exports = exports["default"];

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj) {
    return !!obj && (obj.constructor === Object || obj.constructor === undefined);
};

module.exports = exports["default"];

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
       value: true
});
exports.default = isPrimitive;
function isPrimitive(obj) {
       return !(obj instanceof Object) || obj instanceof Boolean || typeof obj === 'boolean' || obj instanceof Number || typeof obj === 'number' || obj instanceof String || typeof obj === 'string';
}
module.exports = exports['default'];

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj) {
    return !(0, _isNullOrUndefined2.default)(obj) && (0, _isFunction2.default)(obj.valueOf) ? obj.valueOf() : obj;
};

var _isNullOrUndefined = __webpack_require__(11);

var _isNullOrUndefined2 = _interopRequireDefault(_isNullOrUndefined);

var _isFunction = __webpack_require__(7);

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_js__ = __webpack_require__(62);


/** Built-in value references. */
var Symbol = __WEBPACK_IMPORTED_MODULE_0__root_js__["a" /* default */].Symbol;

/* harmony default export */ __webpack_exports__["a"] = (Symbol);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(63);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__["a" /* default */])(value) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__["a" /* default */])(value) != objectTag) {
    return false;
  }
  var proto = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__["a" /* default */])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["a"] = (isPlainObject);


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ActionTypes; });
/* harmony export (immutable) */ __webpack_exports__["a"] = createStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_symbol_observable__);



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = observable, _ref2;
}

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _namespace = __webpack_require__(8);

Object.defineProperty(exports, 'REDUX_MODELIZAR', {
    enumerable: true,
    get: function get() {
        return _namespace.REDUX_MODELIZAR;
    }
});

var _createStore = __webpack_require__(37);

Object.defineProperty(exports, 'createStore', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_createStore).default;
    }
});

var _combineReducers = __webpack_require__(35);

Object.defineProperty(exports, 'combineReducers', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_combineReducers).default;
    }
});

var _compose = __webpack_require__(36);

Object.defineProperty(exports, 'compose', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_compose).default;
    }
});

var _applyMiddleware = __webpack_require__(34);

Object.defineProperty(exports, 'applyMiddleware', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_applyMiddleware).default;
    }
});

var _enableReduxDevTools = __webpack_require__(38);

Object.defineProperty(exports, 'enableReduxDevTools', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_enableReduxDevTools).default;
    }
});

var _undoable = __webpack_require__(16);

Object.defineProperty(exports, 'undoable', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_undoable).default;
    }
});

var _bindHistory = __webpack_require__(15);

Object.defineProperty(exports, 'bindHistory', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_bindHistory).default;
    }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _redux = __webpack_require__(13);

var _immutableJs = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Override `applyMiddleware` of `redux` to support to pass array argument.
 */


module.exports = exports['default'];

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reducers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var action = arguments[1];

        // NOTE: The initial state will be made as an immutable in `createStore`.
        Object.keys(reducers).forEach(function (key) {
            var reducer = reducers[key];
            var path = [key];

            if (!(0, _immutableJs.hasOwn)(state, key)) {
                // No initial value?
                var stateForKey = reducer(undefined, action);

                if (_immutableJs2.default.isInstance(state)) {
                    state = state.set(path, stateForKey);
                } else {
                    state[key] = stateForKey;
                }
            } else {
                state = state.update(path, function (state) {
                    return reducer(state, action);
                });
            }
        });
        return state;
    };
};

var _immutableJs = __webpack_require__(0);

var _immutableJs2 = _interopRequireDefault(_immutableJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

// NOTE: Redux Devtools supports performance monitoring

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var args = [].concat(Array.prototype.slice.call(arguments));

    if (args.length === 1 && (0, _immutableJs.isArray)(args[0])) {
        args = args[0];
    }

    return _redux.compose.apply(undefined, _toConsumableArray(args));
};

var _redux = __webpack_require__(13);

var _immutableJs = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Override `compose` of `redux` to support to pass array argument.
 */


module.exports = exports['default'];

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (reducer, preloadedState, enhancer, options) {
    if ((0, _immutableJs.isFunction)(preloadedState)) {
        options = enhancer;
        enhancer = preloadedState;
        preloadedState = undefined;
    }

    var globalOpts = options || {};
    var undoable = globalOpts.undoable;
    globalOpts.debug = globalOpts.debug === true;
    globalOpts.undoable = function (state) {
        return !!undoable && undoable(state, (0, _toPlain.extractFunctionFrom)(state));
    };

    reducer = immutable((0, _modelizar2.default)(reducer, globalOpts));

    var store = (0, _redux.createStore)(reducer, preloadedState, enhancer);
    var batching = false;
    var actions = [];
    var _dispatch = store.dispatch,
        getState = store.getState;


    function startBatch() {
        actions = [];
        batching = true;
    }

    function _doBatch(meta) {
        var savedActions = actions.concat();

        batching = false;
        actions = [];
        // Do mutation even if error happened.
        if (savedActions.length > 0) {
            _dispatch((0, _actions.batchMutateState)(savedActions, meta));
        }
    }

    return _extends({}, store, {
        configure: globalOpts,
        registerFunction: _functions.registerFunction,
        dispatch: function dispatch(action) {
            if (batching) {
                actions.push(action);
                return action;
            } else {
                return _dispatch(action);
            }
        },
        /**
         * @param {Immutable} [state] If no specified, map the root state.
         * @param {Boolean} [immutable=true]
         * @return {*} Type depends on `state`.
         */
        mapping: function mapping(state) {
            var _this = this;

            var immutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if ((0, _immutableJs.isBoolean)(state)) {
                immutable = state;
                state = getState();
            }
            (0, _invariant2.default)(_immutableJs2.default.isImmutable(state), 'Expected the parameter "state" is an Immutable or primitive object. But, received \'' + state + '\'.');

            var currentState = state;
            var target = (0, _mapState2.default)(_extends({}, this), currentState, null, immutable);

            if ((0, _immutableJs.isObject)(target)) {
                this.subscribe(function () {
                    var previousState = currentState;
                    currentState = getState().get(getState().path(state));

                    // NOTE: If the mapped state doesn't exist, no need to update the mapping object.
                    if (currentState && !_immutableJs2.default.equals(currentState, previousState)) {
                        (0, _mapState2.default)(_extends({}, _this), currentState, previousState, target, immutable);
                    }
                });
            }
            return target;
        },
        /**
         * @param {Object} target
         * @param {Object} [mapping={}] e.g. `{docs: (state) => state.get('doc')}`
         * @param {Boolean} [immutable=true] Set `true`
         *          if direct assignment mutation is not allowed.
         * @return {Object} `target`
         */
        bind: function bind(target) {
            var _this2 = this;

            var mapping = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var immutable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var currentState;
            var bind = function bind() {
                var previousState = currentState;
                currentState = getState();

                (0, _forEach2.default)(mapping, function (getter, prop) {
                    var previous = previousState && getter(previousState);
                    var current = currentState && getter(currentState);
                    if (_immutableJs2.default.equals(current, previous)) {
                        return;
                    }

                    if (current) {
                        target[prop] = (0, _mapState2.default)(_extends({}, _this2), current, previous, target[prop], immutable);
                    } else {
                        target[prop] = current;
                    }
                });
                return bind;
            };
            // Trigger first binding.
            // NOTE: Using this.subscribe to make sure
            // the listener executing order is same as the subscribing order.
            this.subscribe(bind());

            return target;
        },
        isBatching: function isBatching() {
            return batching;
        },
        /**
         * @param {Function} batch The scope function to do batching mutations.
         * @param {Object} [meta={}] The extra information of triggering the batch.
         *          e.g. `{method: 'ClassName$methodName'}`
         */
        doBatch: function doBatch(batch) {
            var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (!(batch instanceof Function)) {
                return;
            } else if (batching) {
                return batch();
            }

            try {
                startBatch();
                return batch();
            } finally {
                // Do mutation even if error happened.
                _doBatch(meta);
            }
        }
    });
};

var _invariant = __webpack_require__(12);

var _invariant2 = _interopRequireDefault(_invariant);

var _redux = __webpack_require__(13);

var _immutableJs = __webpack_require__(0);

var _immutableJs2 = _interopRequireDefault(_immutableJs);

var _forEach = __webpack_require__(45);

var _forEach2 = _interopRequireDefault(_forEach);

var _functions = __webpack_require__(17);

var _toPlain = __webpack_require__(18);

var _toPlain2 = _interopRequireDefault(_toPlain);

var _mapState = __webpack_require__(39);

var _mapState2 = _interopRequireDefault(_mapState);

var _modelizar = __webpack_require__(42);

var _modelizar2 = _interopRequireDefault(_modelizar);

var _actions = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function immutable(reducer) {
    var immutableOptions = {
        toPlain: _toPlain2.default
    };

    return function (state, action) {
        state = _immutableJs2.default.create(state, immutableOptions);

        state = reducer(state, action);

        return _immutableJs2.default.create(state, immutableOptions);
    };
}

module.exports = exports['default'];

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = enableReduxDevTools;

var _immutableJs = __webpack_require__(0);

var _immutableJs2 = _interopRequireDefault(_immutableJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/arqex/freezer-redux-devtools
// https://github.com/gaearon/redux-devtools
// https://github.com/zalmoxisus/redux-devtools-extension
// http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
function enableReduxDevTools() {
    var extension = window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension;

    return extension ? extension({
        // Adapt to Redux Dev Tools v2.12+
        serialize: {
            // Convert to JSON object
            replacer: function replacer(key, value) {
                return value;
            },
            // Convert to State object
            reviver: function reviver(key, value) {
                return _immutableJs2.default.isImmutable(value) ? value : _immutableJs2.default.create(value);
            }
        },
        // NOTE: In the latest version, (de)serializeState are replaced by serialize
        // See https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
        deserializeState: function deserializeState(state) {
            return _immutableJs2.default.isImmutable(state) ? state : _immutableJs2.default.create(state);
        },
        serializeState: function serializeState(key, value) {
            return value;
        }
    }) : function (f) {
        return f;
    };
}
module.exports = exports['default'];

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (store, newState, oldState, obj) {
    var immutable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    if ((0, _immutableJs.isBoolean)(obj)) {
        immutable = obj;
        obj = undefined;
    } else if ((0, _immutableJs.isBoolean)(newState)) {
        immutable = newState;
        obj = undefined;
        newState = undefined;
        oldState = undefined;
    }

    if (!newState) {
        newState = store.getState();
    }
    // TODO Compare new and old, then update the differences.

    return mapStateToObj(store, newState, obj, null, immutable);
};

var _invariant = __webpack_require__(12);

var _invariant2 = _interopRequireDefault(_invariant);

var _immutableJs = __webpack_require__(0);

var _immutableJs2 = _interopRequireDefault(_immutableJs);

var _instance = __webpack_require__(46);

var _instance2 = _interopRequireDefault(_instance);

var _parseRegExp = __webpack_require__(47);

var _parseRegExp2 = _interopRequireDefault(_parseRegExp);

var _toPlain = __webpack_require__(18);

var _actions = __webpack_require__(3);

var _bindHistory = __webpack_require__(15);

var _bindHistory2 = _interopRequireDefault(_bindHistory);

var _utils = __webpack_require__(41);

var _observe = __webpack_require__(40);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *         <------------[reflect]-------------
 * (Model)                                     (State)
 *         --[bind]--> (Mapper) --[connect]-->
 *
 * NOTE: An object only can map the different statuses of the same state.
 * Immutable state instances will have the same GUID if they represent the same state.
 */
function Mapper(store, state, immutable) {
    this.store = store;
    this.state = state;
    this.obj = null;
    this.immutable = immutable !== false;
    this.updating = false;
}

Mapper.prototype.connect = function (state) {
    if (!_immutableJs2.default.same(this.state, state)) {
        throw new Error('Trying to map another different state is not allowed.');
    }
    this.state = state;
};

/**
 * @param {Object} obj
 * @param {Object} root
 */
Mapper.prototype.bind = function (obj, root) {
    var _this = this;

    if (this.obj || (0, _utils.isBoundState)(obj)) {
        return;
    }
    (0, _utils.reflectProto)(obj, this);

    this.obj = obj;

    var reservedKeys = [_toPlain.FN_SENTINEL, _toPlain.CLASS_SENTINEL];
    var state = this.state;
    state.keys().filter(function (key) {
        return reservedKeys.indexOf(key) < 0;
    }).forEach(function (key) {
        _this.mapping(state, key, root);
    });
};

Mapper.prototype.mapping = function (state, prop, root) {
    var _this2 = this;

    var obj = this.obj;
    if (!(0, _immutableJs.isConfigurable)(obj, prop) || !(0, _immutableJs.isEnumerable)(obj, prop)) {
        return;
    }

    var property = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = property && property.get;
    var setter = property && property.set;

    var isWritableProp = (0, _immutableJs.isWritable)(obj, prop);
    var propVal = mapStateToObj(this.store, state.get([prop]), obj[prop], root, this.immutable, function (val) {
        obj[prop] = val;
    });

    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: function get() {
            // NOTE: Do not accept the value from the original getter,
            // just call it for some reason like observing dependencies collection.
            getter && getter.call(obj);
            return propVal;
        },
        set: function set(newVal) {
            if (!_this2.updating && _this2.immutable && !_this2.store.isBatching()) {
                // TODO 开发阶段抛出异常，发布阶段log warning。redux-modelizar提供全局的配置
                throw new Error('Immutable state mapping:' + ' object property assignment is not allowed,' + ' please do this in it\'s prototype methods.');
            }

            if (!isWritableProp || propVal === newVal) {
                return;
            }

            propVal = newVal;
            setter && setter.call(obj, propVal);

            if (!_this2.updating) {
                _this2.store.dispatch((0, _actions.mutateState)(obj, [prop], propVal));
            }
        }
    });
};

Mapper.prototype.update = function (newState, root) {
    var _this3 = this;

    var store = this.store;
    var oldState = this.state;
    if (this.updating || _immutableJs2.default.equals(oldState, newState) || !_immutableJs2.default.same(oldState, newState)) {
        return;
    }
    this.connect(newState);

    var obj = this.obj;

    var oldStateKeys = oldState.keys().sort();
    var newStateKeys = newState.keys().sort();
    if (newState.isArray()) {
        var oldSize = oldState.size();
        var newSize = newState.size();

        if (oldSize > newSize) {
            Array.prototype.splice.call(obj, newSize, oldSize - newSize);
        } else if (oldSize < newSize) {
            for (var i = oldSize; i < newSize; i++) {
                if ((0, _immutableJs.hasOwn)(newState, i)) {
                    this.mapping(newState, i, root);
                }
            }
        }
    } else {
        // Remove redundant properties.
        oldStateKeys.forEach(function (key) {
            if (!(0, _immutableJs.hasOwn)(newState, key) && (0, _immutableJs.isConfigurable)(obj, key)) {
                delete obj[key];
            }
        });
        // Bind new properties to `obj`
        newStateKeys.forEach(function (key) {
            if (!(0, _immutableJs.hasOwn)(oldState, key)) {
                _this3.mapping(newState, key, root);
            }
        });
    }

    this.updating = true;
    try {
        newStateKeys.forEach(function (key) {
            var oldSubState = oldState.get([key]);
            var newSubState = newState.get([key]);

            if ((0, _immutableJs.isWritable)(obj, key) && !_immutableJs2.default.equals(oldSubState, newSubState)) {
                obj[key] = mapStateToObj(store, newSubState, obj[key], root, _this3.immutable, function (sub) {
                    obj[key] = sub;
                });
            }
        });
        (0, _observe.notifyDep)(obj);
    } finally {
        this.updating = false;
    }
};

function createRealObj(state, realObj) {
    var obj = realObj;
    if (!_immutableJs2.default.same(realObj, state)) {
        if (state.isArray()) {
            obj = new Array(state.size());
        } else if (state.isDate()) {
            obj = new Date(state.valueOf());
        } else if ((0, _toPlain.hasClassSentinel)(state)) {
            var ctor = (0, _toPlain.extractFunctionFrom)(state);
            (0, _invariant2.default)(ctor, 'No class constructor \'' + state[_toPlain.CLASS_SENTINEL] + '\' was registered.');
            obj = (0, _instance2.default)(ctor);
        } else {
            obj = {};
        }
    }
    _immutableJs2.default.guid(obj, _immutableJs2.default.guid(state));

    return obj;
}

function mapStateToObj(store, state, obj, rootObj, immutable, cb) {
    if (!_immutableJs2.default.isInstance(state)) {
        return state;
    } else if (state.isCycleRef()) {
        var subPath = store.getState().subPath(rootObj, state.valueOf());
        (0, _invariant2.default)(subPath, 'The cycle reference object isn\'t sub node of the root object.');

        return (0, _immutableJs.getNodeByPath)(rootObj, subPath);
    } else if (state.isRegExp()) {
        return (0, _parseRegExp2.default)(state.valueOf());
    } else if ((0, _toPlain.hasFnSentinel)(state)) {
        return (0, _toPlain.extractFunctionFrom)(state);
    }

    obj = createRealObj(state, obj);
    // Do something (e.g. assignment `obj` to top object)
    // before mapping `state` to `obj` deeply.
    cb && cb(obj);

    var root = rootObj || obj;
    var mapper = (0, _utils.getBoundMapper)(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable);
        mapper.bind(obj, root);
    } else {
        mapper.update(state, root);
    }

    // Bind history
    if (store.configure.undoable(state)) {
        (0, _bindHistory2.default)(store, obj, true);
    }
    return obj;
}

/**
 * @param {Object} store
 * @param {Immutable} [newState]
 * @param {Immutable} [oldState]
 * @param {*} [obj] The target of state mapping.
 * @param {Boolean} [immutable=true]
 * @return {*} Type depends on `state`.
 */
module.exports = exports['default'];

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PROP_OBSERVER = undefined;
exports.isObserved = isObserved;
exports.observeCheck = observeCheck;
exports.notifyDep = notifyDep;

var _immutableJs = __webpack_require__(0);

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

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reflectProto = reflectProto;
exports.isBoundState = isBoundState;
exports.getBoundMapper = getBoundMapper;

var _immutableJs = __webpack_require__(0);

var _class = __webpack_require__(44);

var _actions = __webpack_require__(3);

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

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reducer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.undoable) {
        return mutationWithUndoable(reducer, options);
    } else {
        return pureMutation(reducer, options);
    }
};

var _actions = __webpack_require__(4);

var _reducer = __webpack_require__(5);

var _actions2 = __webpack_require__(3);

var _reducer2 = __webpack_require__(43);

function mutationWithUndoable(reducer, options) {
    return function (state) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        switch (action.type) {
            case _actions2.BATCH_MUTATE:
                action.actions.forEach(function (action) {
                    var path = state.path(action.$target);
                    do {
                        state = state.set(path, (0, _reducer.startBatch)(state.get(path), action));
                        path && path.pop();
                    } while (path && path.length > 0);
                });
                action.actions.forEach(function (action) {
                    state = mutationWithUndoable(reducer, options)(state, action);
                });
                action.actions.forEach(function (action) {
                    var path = state.path(action.$target);
                    do {
                        state = state.set(path, (0, _reducer.endBatch)(state.get(path), action));
                        path && path.pop();
                    } while (path && path.length > 0);
                });
                return state;
            case _actions.UNDOABLE_INIT:
            case _actions.UNDOABLE_UNDO:
            case _actions.UNDOABLE_REDO:
            case _actions.UNDOABLE_CLEAR:
            case _actions.UNDOABLE_START_BATCH:
            case _actions.UNDOABLE_END_BATCH:
                return (0, _reducer2.undoableMutate)(state, action, options);
            case _actions2.MUTATE_STATE:
            case _actions2.REMOVE_SUB_STATE:
                return (0, _reducer2.mutate)(state, action, options);
            default:
                return reducer(state, action);
        }
    };
}

function pureMutation(reducer, options) {
    return function (state) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        switch (action.type) {
            case _actions2.BATCH_MUTATE:
                action.actions.forEach(function (action) {
                    state = pureMutation(reducer, options)(state, action);
                });
                return state;
            default:
                return reducer(state, action);
        }
    };
}

module.exports = exports['default'];

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.undoableMutate = undoableMutate;
exports.mutate = mutate;

var _immutableJs = __webpack_require__(0);

var _undoable = __webpack_require__(16);

var _undoable2 = _interopRequireDefault(_undoable);

var _actions = __webpack_require__(4);

var _reducer = __webpack_require__(5);

var _actions2 = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyReducer = function emptyReducer(state, action) {
    return state;
};
// undoable undo/redo/batching/clear时会指定目标，通过目标找到path并调用undoable更新该目标的状态
// undoable insert仅在有更新时发生，其仅需拦截更新path上的节点即可
function pathNodeMutate(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return false;
    };
    var rootState = arguments[3];

    var target = state.valueOf();
    var opts = filter(state);

    if (opts) {
        opts = (0, _immutableJs.isObject)(opts) ? opts : {};
        // NOTE: `state` already be mutated,
        // so trigger initializing history
        // by passing the original state in `rootState`.
        if (action.type !== _actions.UNDOABLE_INIT && !(0, _reducer.getHistory)(target)) {
            var path = rootState.path(target);
            var oldState = rootState.get(path);
            (0, _undoable2.default)(emptyReducer, opts)(oldState, (0, _actions.init)(target));
        }
        return (0, _undoable2.default)(emptyReducer, opts)(state, action);
    } else {
        return state;
    }
}

function undoableMutate(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var rootState = state;
    var path = state.path(action.$target);

    return state.update(path, function (state) {
        return pathNodeMutate(state, action, options.undoable, rootState);
    });
}

function mutate(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var rootState = state;
    var path = state.path(action.$target);
    var subPath = (0, _immutableJs.extractPath)(action.key);

    return state.update(path, function (state) {
        switch (action.type) {
            case _actions2.REMOVE_SUB_STATE:
                return state.remove(subPath);
            default:
                // Make immutable value from root state to
                // make sure the cycle reference can be processed.
                return rootState.set(path.concat(subPath), action.value).get(path);
        }
    }, function (state) {
        return pathNodeMutate(state, action, options.undoable, rootState);
    });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = forEach;
/**
 * Try using the original `forEach` function,
 * if it doesn't exist, then trying traverse
 * every key and value by `Object.keys()`.
 */
function forEach(collection, iteratee) {
    if (!collection || !iteratee || !(collection instanceof Object)) {
        return;
    }

    if (typeof collection.forEach === 'function') {
        collection.forEach(iteratee);
    } else {
        Object.keys(collection).forEach(function (key) {
            var val = collection[key];

            return iteratee(val, key, collection);
        });
    }
}
module.exports = exports['default'];

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = instance;
function instance(Ctor) {
    try {
        return new Ctor();
    } catch (e) {
        throw new Error("Exception while creating new instance for " + Ctor + "." + (" Please make sure " + Ctor + " supports no-argument constructor: " + e));
    }
}
module.exports = exports["default"];

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (exp) {
    if (typeof exp === 'string' && /^\/.+\/([igm]*)$/.test(exp)) {
        // NOTE: Avoid xss attack
        return new Function('return ' + exp + ';')();
    } else {
        return null;
    }
};

module.exports = exports['default'];

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _invariant = __webpack_require__(12);

var _invariant2 = _interopRequireDefault(_invariant);

var _isPlainObject = __webpack_require__(25);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isObject = __webpack_require__(1);

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = __webpack_require__(2);

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = __webpack_require__(7);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isDate = __webpack_require__(23);

var _isDate2 = _interopRequireDefault(_isDate);

var _isRegExp = __webpack_require__(53);

var _isRegExp2 = _interopRequireDefault(_isRegExp);

var _isPrimitive = __webpack_require__(26);

var _isPrimitive2 = _interopRequireDefault(_isPrimitive);

var _isNullOrUndefined = __webpack_require__(11);

var _isNullOrUndefined2 = _interopRequireDefault(_isNullOrUndefined);

var _isEnumerable = __webpack_require__(24);

var _isEnumerable2 = _interopRequireDefault(_isEnumerable);

var _createNE = __webpack_require__(20);

var _createNE2 = _interopRequireDefault(_createNE);

var _hasOwn = __webpack_require__(21);

var _hasOwn2 = _interopRequireDefault(_hasOwn);

var _guid = __webpack_require__(6);

var _guid2 = _interopRequireDefault(_guid);

var _extractPath = __webpack_require__(19);

var _extractPath2 = _interopRequireDefault(_extractPath);

var _getNodeByPath = __webpack_require__(10);

var _getNodeByPath2 = _interopRequireDefault(_getNodeByPath);

var _cloneNode = __webpack_require__(9);

var _cloneNode2 = _interopRequireDefault(_cloneNode);

var _copyNodeByPath = __webpack_require__(49);

var _copyNodeByPath2 = _interopRequireDefault(_copyNodeByPath);

var _mergeNode = __webpack_require__(51);

var _mergeNode2 = _interopRequireDefault(_mergeNode);

var _forEachNode = __webpack_require__(50);

var _forEachNode2 = _interopRequireDefault(_forEachNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 功能特性：
 * - Immutable对象反映原始对象的完整结构，但各属性均为只读，一切变更均通过接口进行
 * - Primitive自身即为immutable，无需处理
 * - 支持将Date、RegExp转换为Plain object
 * - 支持通过外部函数对Function和复杂对象进行Plain转换
 * - 支持循环引用结构，并确保结构不丢失（循环引用检查始终在root进行）
 * - 支持对循环引用的更新，其最终在真实被引用对象上做变更
 * - 可快速定位到处于任意位置的对象，而无需遍历
 * - 可快速实施变更，而无需clone整个数据结构
 * - 同源Immutable的差异对比，即，比较前后的变更情况，避免全结构遍历
 */

var IMMUTABLE_PATH_LINK = '[[ImmutablePathLink]]';
var IMMUTABLE_CYCLE_REF = '[[ImmutableCycleRef]]';
var IMMUTABLE_DATE = '[[ImmutableDate]]';
var IMMUTABLE_REGEXP = '[[ImmutableRegExp]]';

function getPathLink(obj) {
    return obj[IMMUTABLE_PATH_LINK] ? obj[IMMUTABLE_PATH_LINK]() : {};
}

function _isCycleRef(obj) {
    return (0, _hasOwn2.default)(obj, IMMUTABLE_CYCLE_REF);
}

/**
 * Arrive the actual node following the cycle reference node.
 */
function extractImmutablePath(immutable, path) {
    var untilToEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var extractedPath = (0, _extractPath2.default)(path);
    if (!extractedPath || extractedPath.length === 0) {
        return extractedPath;
    }

    var realPath = [];
    var node = immutable;
    for (var i = 0, len = extractedPath.length; untilToEnd ? i <= len : i < len; i++) {
        // Maybe some cycle reference was referenced by other,
        // just follow cycle reference until to the real node,
        // or unlimited recursion error is thrown.
        while (_isCycleRef(node)) {
            // NOTE: The path is always starting from root node.
            realPath = immutable.path(node.valueOf());

            if (i < extractedPath.length) {
                node = immutable.get(realPath);
            } else {
                break;
            }
        }

        if (i < extractedPath.length) {
            if ((0, _isPrimitive2.default)(node)) {
                return null; // Broken path!
            } else {
                var key = extractedPath[i];
                node = node[key];
                realPath.push(key);
            }
        }
    }
    return realPath;
}

function createImmutable(obj) /*, rootPathLink, rootGUID*/{
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (isImmutable(obj)) {
        return obj;
    }

    // Make sure the guid was bound to `obj`.
    var objGUID = (0, _guid2.default)(obj);
    // NOTE: Do not record current obj's path link.
    // Because the same immutable object may be referenced more than once.
    var rootObjPathLink = arguments[2];
    var rootObjGUID = arguments[3];
    var objPathLink = {};

    // Hold current node in the root path link to
    // detect the cycle reference in the depth direction at root node.
    rootObjPathLink && (rootObjPathLink[objGUID] = {});

    function isCycleRefTo(target) {
        var targetGUID = (0, _guid2.default)(target);
        return contains(targetGUID) /* cross cycle reference check */
        || targetGUID === rootObjGUID /* root cycle reference check */
        || !!rootObjPathLink && rootObjPathLink[targetGUID] /* depth cycle reference check */;
    }

    function _hasCycleRefs() {
        for (var key in objPathLink) {
            if (objPathLink[key].refer) {
                return true;
            }
        }
        return false;
    }

    function bindValue(obj, value, key, enumerable) {
        Object.defineProperty(obj, key, {
            enumerable: enumerable,
            value: value
        });

        // Record current path link and merge path link of value.
        if (!(0, _isPrimitive2.default)(value)) {
            objPathLink[(0, _guid2.default)(value)] = Object.freeze({
                top: (0, _guid2.default)(obj),
                path: '' + key,
                refer: _isCycleRef(value)
            });
            // TODO 如何处理挂载的Immutable子树中存在的循环引用？
            // TODO 如何处理循环引用的循环引用成环问题？需要确保不出现引用环！！
            var valuePathLink = getPathLink(value);
            Object.assign(objPathLink, valuePathLink);

            // Hold all sub nodes in the root path link to
            // detect the cycle references between different sub-tree.
            rootObjPathLink && Object.assign(rootObjPathLink, objPathLink);
        }
    }

    function contains(guid) {
        return !!objPathLink[guid] || guid === objGUID;
    }

    function getPath(guid) {
        if (!contains(guid)) {
            return undefined;
        }

        var path = [];
        var nodeGUID = guid;
        while (nodeGUID && nodeGUID !== objGUID) {
            var link = objPathLink[nodeGUID];
            // NOTE: If link is broken, just throw error.
            path.unshift(link.path);
            nodeGUID = link.top;
        }
        return path;
    }

    var globalOpts = options;
    var toPlain = globalOpts.toPlain;
    var createInnerImmutable = function createInnerImmutable(obj, rootPathLink, rootGUID) {
        return createImmutable(obj, globalOpts, rootPathLink, rootGUID);
    };
    var isPlainObj = (0, _isPlainObject2.default)(obj);
    var isArrayObj = (0, _isArray2.default)(obj);
    var isDateObj = (0, _isDate2.default)(obj);
    var isRegExpObj = (0, _isRegExp2.default)(obj);

    // Convert source object.
    var processedObj = obj;
    if (isDateObj) {
        processedObj = _defineProperty({}, IMMUTABLE_DATE, obj.getTime());
    } else if (isRegExpObj) {
        processedObj = _defineProperty({}, IMMUTABLE_REGEXP, obj.toString());
    } else if ((0, _isFunction2.default)(obj)) {
        (0, _invariant2.default)((0, _isFunction2.default)(toPlain), 'Detected the source object is a Function or a complex Object,' + ' the "options.toPlain" must be specified to make sure plain the source object correctly.');
        processedObj = toPlain(obj);
        (0, _invariant2.default)((0, _isPlainObject2.default)(processedObj), 'Expected to convert the source object to a plain object,' + (' but "options.toPlain" returned \'' + processedObj + '\'.'));
    } else if (!isPlainObj && !isArrayObj && (0, _isFunction2.default)(toPlain)) {
        processedObj = toPlain(obj);
        (0, _invariant2.default)((0, _isPlainObject2.default)(processedObj), 'Expected to convert the source object to a plain object,' + (' but "options.toPlain" returned \'' + processedObj + '\'.'));
    }
    // Keep the original guid.
    (0, _guid2.default)(processedObj, objGUID);

    // Define prototype methods.
    var privateMethods = _defineProperty({}, IMMUTABLE_PATH_LINK, function () {
        return Object.assign({}, objPathLink);
    });

    var commonMethods = {
        toString: function toString() {
            return JSON.stringify(this);
        },
        valueOf: function valueOf() {
            if (this.isDate()) {
                return this[IMMUTABLE_DATE];
            } else if (this.isRegExp()) {
                return this[IMMUTABLE_REGEXP];
            } else if (this.isCycleRef()) {
                return this[IMMUTABLE_CYCLE_REF];
            } else {
                return this;
            }
        },
        toJS: function toJS() {
            return this;
        },
        toJSON: function toJSON() {
            return this;
        },
        isArray: function isArray() {
            return isArrayObj;
        },
        isDate: function isDate() {
            return (0, _hasOwn2.default)(this, IMMUTABLE_DATE);
        },
        isRegExp: function isRegExp() {
            return (0, _hasOwn2.default)(this, IMMUTABLE_REGEXP);
        },
        isCycleRef: function isCycleRef() {
            return _isCycleRef(this);
        },
        hasCycleRefs: function hasCycleRefs() {
            return _hasCycleRefs();
        },
        /** Deeply check if the specified immutable is equal to `this`. */
        equals: function equals(other) {
            return Immutable.equals(this, other);
        },
        /** Check if `this` and `other` represent a same object or not. */
        same: function same(other) {
            return Immutable.same(this, other);
        },
        /**
         * @return {String[]} Return the index of elements if the immutable self is an Array-like object.
         */
        keys: function keys() {
            return this.isArray() ? Array.apply(null, new Array(this.size())).map(function (v, i) {
                return i;
            }) : Object.keys(this);
        },
        /**
         * Get the array path of the specified node from the root node.
         *
         * @param {String/Object} node The guid of node, or node self.
         * @return {Array/undefined} If the specified node is root node, return `[]`.
         *          Else if the specified node isn't on the object tree, return `undefined`.
         */
        path: function path(node) {
            var nodeGUID = (0, _isPrimitive2.default)(node) ? node : (0, _guid2.default)(node);
            return getPath(nodeGUID);
        },
        /**
         * Get the relative path from `topNode` to `subNode`.
         *
         * @param {Object/String} [topNode] The guid of top node, or node self.
         * @param {Object/String} [subNode] The guid of sub node, or node self.
         * @return {Array/undefined} Return `[]` if two nodes are same,
         *          otherwise return `undefined` if it's unreachable from `topNode` to `subNode`.
         */
        subPath: function subPath(topNode, subNode) {
            var topNodePath = this.path(topNode);
            var subNodePath = this.path(subNode);

            if (!topNodePath || !subNodePath) {
                return undefined;
            }
            for (var i = 0; i < topNodePath.length; i++) {
                if (topNodePath[i] !== subNodePath[i]) {
                    return undefined;
                }
            }
            return subNodePath.slice(topNodePath.length);
        },
        /**
         * Check if the specified node is on the object tree.
         *
         * @param {String/Object} node The guid of node, or node self.
         */
        has: function has(node) {
            var nodeGUID = (0, _isPrimitive2.default)(node) ? node : (0, _guid2.default)(node);
            return contains(nodeGUID);
        },
        /**
         * Get the target immutable node by the specified path.
         *
         * If the `path` contains cycle reference node,
         * it will be turn back to the real node and
         * continue to search until to the target node.
         *
         * NOTE: The target node maybe contains cycle reference nodes,
         * they can be processed when need.
         *
         * @param {Array/String} path The array path, or string path split by `.`.
         * @return {Immutable/undefined} The immutable node,
         *          or `undefine` if the `path` cannot be reached.
         *          If `path` is empty, just return the Immutable self.
         */
        get: function get(path) {
            var extractedPath = extractImmutablePath(this, path, false);
            var root = (0, _getNodeByPath2.default)(this, extractedPath);
            return createInnerImmutable(root);
        },
        /**
         * Set new value to the target node or create a new node.
         *
         * @param {Array/String} path The array path, or string path split by `.`.
         * @param {*} value The new value which will replace the target node.
         * @return {Immutable} Return the Immutable self if the `path` is unreachable.
         */
        set: function set(path, value) {
            // NOTE: Avoid to replace the root when the path is unreachable!
            var extractedPath = extractImmutablePath(this, path, false);

            var root;
            if (extractedPath && extractedPath.length === 0) {
                root = value;
            } else {
                // TODO 若value为Immutable，则其可能存在A引用当前Immutable内的B。注意：其内部的循环引用无需处理，但若是其引用了A，则最终需将其调整为引用B
                // Copy and create a new node, then make it immutable.
                // NOTE: Do not make value immutable directly,
                // the new immutable will collect path link and process cycle references.
                root = (0, _copyNodeByPath2.default)(this, extractedPath, function () {
                    return value;
                });
            }
            return createInnerImmutable(root);
        },
        /**
         * Update the target node.
         *
         * @param {Array/String} path The array path, or string path split by `.`.
         * @param {Function} targetNodeUpdater The target node update function
         *          with signature `(node: Immutable, topKey, topNode: Immutable) => *`.
         *          If `path` is empty, the Immutable self will be passed to the updater.
         * @param {Function} [pathNodeUpdater] The path node update function
         *          with signature `(node: Immutable, topKey, topNode: Immutable) => *`.
         */
        update: function update(path, targetNodeUpdater, pathNodeUpdater) {
            var extractedPath = extractImmutablePath(this, path);
            var root = this;

            if ((0, _isFunction2.default)(targetNodeUpdater)) {
                if (extractedPath && extractedPath.length === 0) {
                    root = targetNodeUpdater(root);
                } else {
                    // TODO 若目标节点内还存在循环引用，在updater里该如何处理？传入root，通过root更新子树？
                    root = (0, _copyNodeByPath2.default)(this, extractedPath, function (node, topKey, topNode) {
                        // NOTE: The target node is immutable already.
                        return targetNodeUpdater(node, topKey, topNode);
                    }, pathNodeUpdater ? function (node, topKey, topNode) {
                        node = createInnerImmutable(node);
                        topNode = createInnerImmutable(topNode);
                        return pathNodeUpdater(node, topKey, topNode);
                    } : null);
                }
            }
            return createInnerImmutable(root);
        },
        /**
         * Merge the specified node to `this`.
         *
         * @param {*} value
         * @param {Boolean} [deep=false] Merge deeply or not.
         * @return {Immutable}
         */
        merge: function merge(value, deep) {
            // TODO 将引用节点转换为其指向的节点
            var root = (0, _mergeNode2.default)(this, value, deep);
            return createInnerImmutable(root);
        },
        /**
         * Deeply merge the specified node to `this`.
         * It's equal to `this.merge(value, true)`.
         *
         * @param {*} value
         * @return {Immutable}
         */
        mergeDeep: function mergeDeep(value) {
            return this.merge(value, true);
        },
        /**
         * Remove the specified node.
         *
         * @param {Array/String} path The array path, or string path split by `.`.
         * @return {Immutable} If `path` is null, empty or unreachable, the Immutable self will be returned.
         */
        remove: function remove(path) {
            var extractedPath = extractImmutablePath(this, path);
            // TODO 若移除的包含被引用对象，该如何处理？
            var updater = function updater(target, key, top) {
                return (0, _hasOwn2.default)(top, key) ? (0, _copyNodeByPath.removeTheNode)(target) : target;
            };
            var root = (0, _copyNodeByPath2.default)(this, extractedPath, updater);

            return createInnerImmutable(root);
        },
        /**
         * Clear all properties or elements, and return empty immutable array or object.
         *
         * @return {Immutable} The immutable array or object with the same GUID with `this`.
         */
        clear: function clear() {
            var target = this.isArray() ? [] : {};
            (0, _guid2.default)(target, (0, _guid2.default)(this));

            return createInnerImmutable(target);
        },
        /**
         * Find the matched node.
         *
         * @param {Function} predicate A matching function
         *          with signature `(node: Immutable, topKey, topNode: Immutable) => Boolean`
         * @return {Immutable/undefined} The matched node or `undefined` if no node matched.
         */
        find: function find(predicate) {
            var _this = this;

            var expected;
            if ((0, _isFunction2.default)(predicate)) {
                this.forEach(function (node, key) {
                    var accepted = predicate(node, key, _this);

                    if (accepted) {
                        expected = node;
                    }
                    return !accepted;
                });
            }
            return expected;
        },
        /**
         * Filter the matched properties.
         *
         * @param {Function} predicate A filter function
         *          with signature `(node: Immutable, topKey, topNode: Immutable) => Boolean`
         * @return {Immutable}
         */
        filter: function filter(predicate) {
            var _this2 = this;

            var target = this.isArray() ? [] : {};

            if ((0, _isFunction2.default)(predicate)) {
                this.forEach(function (node, key) {
                    var accepted = predicate(node, key, _this2);

                    if (accepted) {
                        var prop = (0, _isArray2.default)(target) ? target.length : key;
                        target[prop] = node;
                    }
                });
            }
            return createInnerImmutable(target);
        },
        /**
         * Traverse all properties of the target node.
         *
         * If the `path` is null or empty, traverse from the root.
         *
         * @param {Array/String} [path] The array path, or string path split by `.`.
         * @param {Function} sideEffect A traverse function
         *          with signature `(node: Immutable, topKey, topNode: Immutable, fullPath) => Boolean`.
         *          If it return `false`, the traversing will be stop.
         */
        forEach: function forEach(path, sideEffect) {
            if ((0, _isFunction2.default)(path)) {
                sideEffect = path;
                path = [];
            }

            var extractedPath = extractImmutablePath(this, path);
            (0, _forEachNode2.default)(this, extractedPath, sideEffect);
        },
        /**
         * Returns a new Array/Object with values passed through the `mapper`.
         *
         * @param {Function} mapper Mapper function
         *          with signature `(value: Immutable, key, this) => *`.
         * @return {Immutable} If `mapper` isn't specified or no changes happened, return `this`.
         */
        map: function map(mapper) {
            if (!(0, _isFunction2.default)(mapper)) {
                return this;
            }

            var changed = false;
            var target = this.isArray() ? [] : {};
            this.forEach(function (node, topKey, topNode) {
                var newNode = mapper(node, topKey, topNode);

                target[topKey] = newNode;
                newNode !== node && (changed = true);
            });
            // Remain the GUID as the source.
            (0, _guid2.default)(target, (0, _guid2.default)(this));

            return changed ? createInnerImmutable(target) : this;
        },
        /**
         * Reduces the immutable to a value by calling the `reducer` for every entry
         * and passing along the reduced value.
         *
         * @param {Function} reducer Reducer function
         *          with signature `(reduction: Immutable, value: Immutable, key, this) => *`.
         * @param {*} initVal The initial value of reduction.
         * @return {Immutable} If `reducer` isn't specified, return `initVal`.
         */
        reduce: function reduce(reducer, initVal) {
            var target = initVal;

            if ((0, _isFunction2.default)(reducer)) {
                this.forEach(function (node, topKey, topNode) {
                    target = createInnerImmutable(target);
                    target = reducer(target, node, topKey, topNode);
                });
            }
            return createInnerImmutable(target);
        }
    };

    var arrayMethods = {
        /**
         * Put elements to the array tail.
         *
         * @param {...T} values
         * @return {Immutable} If no arguments, return `this`.
         */
        push: function push() {
            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
                values[_key] = arguments[_key];
            }

            if (arguments.length === 0) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this);
            Array.prototype.push.apply(root, arguments);

            return createInnerImmutable(root);
        },
        /**
         * Remove the element at the array tail.
         *
         * @return {Immutable} If it's an empty immutable array, return `this`.
         */
        pop: function pop() {
            if (this.isEmpty()) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this);
            root.pop();
            return createInnerImmutable(root);
        },
        /**
         * Put elements to the array head.
         *
         * @param {...T} values
         * @return {Immutable} If no arguments, return `this`.
         */
        unshift: function unshift() {
            for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                values[_key2] = arguments[_key2];
            }

            if (arguments.length === 0) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this);
            Array.prototype.unshift.apply(root, arguments);

            return createInnerImmutable(root);
        },
        /**
         * Remove the element at the array head.
         *
         * @return {Immutable} If it's an empty immutable array, return `this`.
         */
        shift: function shift() {
            if (this.isEmpty()) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this);
            root.shift();
            return createInnerImmutable(root);
        },
        /**
         * Remove the specified count elements and insert new elements.
         *
         * @param {Number} [start]
         * @param {Number} [removeNum]
         * @param {...T} [values]
         * @return {Immutable} If no arguments, return `this`.
         */
        splice: function splice(start, removeNum) {
            for (var _len3 = arguments.length, values = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                values[_key3 - 2] = arguments[_key3];
            }

            if (arguments.length === 0) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this);
            Array.prototype.splice.apply(root, arguments);

            return createInnerImmutable(root);
        },
        /**
         * Selects a part of an array, and returns the new array.
         *
         * @param {Number} [start]
         * @param {Number} [end]
         * @return {Immutable} If no arguments, return `this`.
         */
        slice: function slice(start, end) {
            if (arguments.length === 0) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this);
            root = Array.prototype.slice.apply(root, arguments);
            (0, _guid2.default)(root, (0, _guid2.default)(this));

            return createInnerImmutable(root);
        },
        /**
         * Joins two or more arrays, and returns a copy of the joined arrays.
         *
         * @param {...T/T[]} [arrays]
         * @return {Immutable} If no arguments, return `this`.
         */
        concat: function concat() {
            for (var _len4 = arguments.length, arrays = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                arrays[_key4] = arguments[_key4];
            }

            if (arguments.length === 0) {
                return this;
            }
            arrays = arrays.map(function (array) {
                if (Immutable.isInstance(array) && array.isArray()) {
                    array = (0, _cloneNode2.default)(array);
                }
                return array;
            });

            var root = (0, _cloneNode2.default)(this);
            root = Array.prototype.concat.apply(root, arrays);
            (0, _guid2.default)(root, (0, _guid2.default)(this));

            return createInnerImmutable(root);
        },
        /**
         * Insert new elements to the specified location.
         *
         * NOTE: If the inserted `values` is a big array,
         * using `.insert()` will be better than `.splice()`.
         *
         * @param {Number} [index]
         * @param {T/T[]} [values]
         * @return {Immutable} If no arguments or `values` is empty, return `this`.
         */
        insert: function insert(index, values) {
            if (arguments.length <= 1) {
                return this;
            }
            if (Immutable.isInstance(values) && values.isArray()) {
                values = (0, _cloneNode2.default)(values);
            }

            var root = (0, _cloneNode2.default)(this);
            [].concat(values).forEach(function (value, i) {
                root.splice(index + i, 0, value);
            });

            return createInnerImmutable(root);
        },
        /**
         * Sort the elements.
         *
         * @param {Function} [compareFn]
         * @return {Immutable} If the size <= 1, return `this`.
         */
        sort: function sort(compareFn) {
            if (this.size() <= 1) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this).sort(compareFn);
            return createInnerImmutable(root);
        },
        /**
         * Reverse the elements.
         *
         * @return {Immutable} If the size <= 1, return `this`.
         */
        reverse: function reverse() {
            if (this.size() <= 1) {
                return this;
            }

            var root = (0, _cloneNode2.default)(this).reverse();
            return createInnerImmutable(root);
        },
        /**
         * Return the first element.
         *
         * @return {*}
         */
        first: function first() {
            return this[0];
        },
        /**
         * Return the last element.
         *
         * @return {*}
         */
        last: function last() {
            return this.isEmpty() ? undefined : this[this.size() - 1];
        },
        /**
         * Return the element which is at `index`.
         *
         * @return {*}
         */
        at: function at(index) {
            return this[parseInt(index, 10)];
        },
        /**
         * Find the location of matched element.
         *
         * @param {Function} predicate A matching function
         *          with signature `(node: Immutable, topKey, topNode: Immutable) => Boolean`
         * @return {Number} Return `-1` if no element matched.
         */
        findIndex: function findIndex(predicate) {
            var index = -1;

            if ((0, _isFunction2.default)(predicate)) {
                this.forEach(function (node, topKey, topNode) {
                    if (predicate(node, topKey, topNode)) {
                        index = topKey;
                        return false;
                    }
                });
            }
            return index;
        },
        size: function size() {
            return this.length;
        },
        isEmpty: function isEmpty() {
            return this.size() === 0;
        }
    };

    var objectMethods = {};

    // Construct and create immutable object.
    var methods = Object.assign({}, privateMethods, commonMethods, isArrayObj ? arrayMethods : objectMethods);
    var immutableProto = Object.create(Immutable.prototype, (0, _createNE2.default)(methods));
    var immutableObj = Object.create(immutableProto);

    var reservedKeys = [_guid.GUID_SENTINEL];
    // Keep the immutable properties in the lower index to make sure to process them before others.
    var objKeys = Object.keys(processedObj).concat(isArrayObj ? ['length'] : []).sort(function (key, other) {
        return Immutable.isInstance(processedObj[key]) ? -1 : Immutable.isInstance(processedObj[other]) ? 1 : 0;
    });
    // NOTE: Make sure GUID was bound at first.
    reservedKeys.concat(objKeys).forEach(function (key) {
        var value = processedObj[key];
        if (isCycleRefTo(value)) {
            value = _defineProperty({}, IMMUTABLE_CYCLE_REF, (0, _guid2.default)(value));
        }
        // Make sure GUID was bound as enumerable property.
        var enumerable = reservedKeys.indexOf(key) >= 0 || (0, _isEnumerable2.default)(processedObj, key);
        var immutableValue = createInnerImmutable(value, rootObjPathLink || objPathLink, rootObjGUID || objGUID);
        bindValue(immutableObj, immutableValue, key, enumerable);
    });

    // Not allow to add new properties or remove, change the existing properties.
    return Object.freeze(immutableObj);
}

function isImmutable(obj) {
    return (0, _isNullOrUndefined2.default)(obj) || (0, _isPrimitive2.default)(obj)
    // Frozen object should be convert to Immutable object also.
    // || Object.isFrozen(obj)
    || Immutable.isInstance(obj);
}

function Immutable() {
    // Just an immutable constructor, no business logic.
    throw new Error('new Immutable() or Immutable() isn\'t supported,' + ' please use Immutable.create() to create an immutable object.');
}

/**
 * Bind GUID to `obj` or get the GUID bound to `obj`.
 *
 * @param {Object} obj
 * @param {String} [id] A custom id which will be bound to `obj`.
 * @param {Boolean} [enumerable=false] Bind id as enumerable property or not?
 * @return {String/Object} Return `obj` if the parameter `id` was specified,
 *          otherwise, return the id bound to `obj`.
 */
Immutable.guid = _guid2.default;
/**
 * Check whether `obj` is an {@link Immutable} object or not.
 *
 * NOTE: `null`, `undefined` or any primitive are immutable too.
 *
 * @param {*} obj
 */
Immutable.isImmutable = isImmutable;
/**
 * Check whether `obj` is an instance of {@link Immutable} or not.
 *
 * @param {*} obj
 */
Immutable.isInstance = function (obj) {
    return obj && (obj instanceof Immutable || obj.constructor === Immutable);
};
/**
 * Create {@link Immutable} instance of `obj`.
 *
 * @param {*} obj
 * @param {Object} [options={}]
 * @param {Function} [options.toPlain]
 *          A plain object converter(Signature: `(value: [Function/Object]) => Object`)
 *          for Function and Complex Object.
 *          e.g. `toPlain: (fn) => ({$fn: 'function name'})`,
 *          `toPlain: (obj) => Object.assign({$class: 'complex class name'}, obj)`
 * @return {Immutable} Return an immutable object, or Array-like immutable object when `obj` is an array.
 */
Immutable.create = function (obj, options) {
    return createImmutable(obj, options);
};
/**
 * Check if `source` and `other` represent a same object.
 *
 * NOTE: The same objects maybe isn't {@link #equals equal}.
 *
 * @return {Boolean}
 */
Immutable.same = function (source, other) {
    return (0, _isObject2.default)(source) && (0, _guid2.default)(source) === (0, _guid2.default)(other);
};
// TODO 1. 返回diff格式的差异，以path为键值；2. 比较path link的增删节点；3. 比较相同id的immutable的属性是否存在差异，但不做深度比较
Immutable.diff = function (source, other) {
    return {};
};
/**
 * Deep value equality check.
 *
 * @return {Boolean}
 */
Immutable.equals = function (source, other) {
    if (source === other || !(0, _isObject2.default)(source) || !(0, _isObject2.default)(other)) {
        return source === other;
    }

    var sourceKeys = Object.keys(source).sort();
    var otherKeys = Object.keys(other).sort();
    // NOTE: Array-like object maybe equal to an actual array.
    if (sourceKeys.length === otherKeys.length) {
        for (var i = 0; i < sourceKeys.length; i++) {
            var sourceKey = sourceKeys[i];
            var otherKey = otherKeys[i];

            if (sourceKey !== otherKey || !Immutable.equals(source[sourceKey], other[otherKey])) {
                return false;
            }
        }
        return true;
    }
    return false;
};

exports.default = Immutable;
module.exports = exports['default'];

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeTheNode = removeTheNode;

exports.default = function (root, path, targetNodeProcessor, pathNodeProcessor) {
    if (!(0, _isObject2.default)(root) || !(0, _isArray2.default)(path) || path.length === 0) {
        return root;
    }

    var pathNodes = [];
    var targetNode = root;
    var topKey = null;
    var topNode = null;
    // Walk to target, ignore Function node.
    for (var i = 0; i < path.length && (0, _isObject2.default)(targetNode); i++) {
        pathNodes.push({
            top: topNode,
            key: topKey
        });

        topNode = targetNode;
        topKey = path[i];
        targetNode = topNode[topKey];
    }
    // Unreachable? Return root.
    if (i < path.length) {
        return root;
    }

    // Process the target node.
    var processedNode = targetNodeProcessor ? targetNodeProcessor(targetNode, topKey, topNode, path.slice()) : targetNode;
    if (processedNode !== targetNode) {
        targetNode = processedNode;
    } else {
        // No mutation
        return root;
    }

    // Go back to the root following the path from bottom to up.
    do {
        if (shouldBeRemoved(targetNode)) {
            // Should be cut?
            // Cut the node from current top
            if (topNode) {
                topNode = (0, _cloneNode2.default)(topNode);
                if ((0, _isArray2.default)(topNode)) {
                    topNode.splice(topKey, 1);
                } else {
                    delete topNode[topKey];
                }
                targetNode = topNode;
            }
            // Already at root? Remove it.
            else {
                    targetNode = undefined;
                }
        }
        // Just update
        else {
                if (topNode) {
                    topNode = (0, _cloneNode2.default)(topNode);
                    topNode[topKey] = targetNode;
                }
                // Process the path node.
                processedNode = pathNodeProcessor ? pathNodeProcessor(targetNode, topKey, topNode, path.slice(0, pathNodes.length)) : targetNode;
                if (processedNode !== targetNode) {
                    targetNode = processedNode;
                    if (shouldBeRemoved(targetNode)) {
                        continue; // Cut the node first.
                    }
                }
                // Mount the processed node on the top.
                if (topNode) {
                    topNode[topKey] = targetNode;
                    targetNode = topNode;
                }
            }

        // Move to the top node.
        var pathNode = pathNodes.pop();
        topKey = pathNode && pathNode.key;
        topNode = pathNode && pathNode.top;
    } while (topNode !== undefined);

    return shouldBeRemoved(targetNode) ? undefined : targetNode;
};

var _isObject = __webpack_require__(1);

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = __webpack_require__(2);

var _isArray2 = _interopRequireDefault(_isArray);

var _cloneNode = __webpack_require__(9);

var _cloneNode2 = _interopRequireDefault(_cloneNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShouldBeRemovedNode = {};
function shouldBeRemoved(node) {
    return node === ShouldBeRemovedNode;
}

function removeTheNode(node) {
    return ShouldBeRemovedNode;
}

/**
 * Make a copy following the `path` from root,
 * and return the new copy of `root` if some changes happened.
 *
 * NOTE:
 * - If the target node isn't mutated, the `pathNodeProcessor`
 *   will not be called and the `root` will be returned;
 * - If the `path` is unreachable, `root` will be returned;
 *
 * @param {Object} root The start node to search.
 * @param {Array} path An array path from root to the target node.
 * @param {Function} [targetNodeProcessor]
 *          The function to process the target node.
 *          Signature: `(targetNode, topKey, topNode, fullPath) => *`.
 * @param {Function} [pathNodeProcessor]
 *          The function to process the path node(including target).
 *          Signature: `(targetNode, topKey, topNode, fullPath) => *`.
 */

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (root, path, sideEffect) {
    var target = (0, _getNodeByPath2.default)(root, path);
    if (!(0, _isObject2.default)(target) || !(0, _isFunction2.default)(sideEffect)) {
        return;
    }

    var keys = target.isArray && target.isArray() ? Array.apply(null, new Array(target.size())).map(function (v, i) {
        return i;
    }) : Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = target[key];

        var ret = sideEffect(value, key, target, path.concat(key));
        if (ret === false) {
            return;
        }
    }
};

var _isObject = __webpack_require__(1);

var _isObject2 = _interopRequireDefault(_isObject);

var _isFunction = __webpack_require__(7);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _getNodeByPath = __webpack_require__(10);

var _getNodeByPath2 = _interopRequireDefault(_getNodeByPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * Traverse all properties of the target node.
 *
 * @param {*} root
 * @param {Array} path
 * @param {Function} sideEffect A traverse function
 *          with signature `(node, topKey, topNode, fullPath) => Boolean`.
 *          If it return `false`, the traversing will be stop.
 */

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mergeNode;

var _isObject = __webpack_require__(1);

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = __webpack_require__(2);

var _isArray2 = _interopRequireDefault(_isArray);

var _guid = __webpack_require__(6);

var _cloneNode = __webpack_require__(9);

var _cloneNode2 = _interopRequireDefault(_cloneNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reservedKeys = [_guid.GUID_SENTINEL];
/**
 * Merge node and return the new merged copy of `target`.
 */
function mergeNode(target, source) {
    var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (target === source || !(0, _isObject2.default)(target) || !(0, _isObject2.default)(source) || (0, _isArray2.default)(target) && !(0, _isArray2.default)(source) || !(0, _isArray2.default)(target) && (0, _isArray2.default)(source)) {
        return source;
    }

    // TODO 处理value内的循环引用，直接忽略循环引用节点，最终由Immutable处理循环引用
    var changed = false;
    var targetCopy = (0, _cloneNode2.default)(target);
    Object.keys(source).forEach(function (key) {
        if (reservedKeys.indexOf(key) >= 0 || target[key] === source[key]) {
            return;
        }

        targetCopy[key] = deep ? mergeNode(target[key], source[key], true) : source[key];
        changed = true;
    });

    return changed ? targetCopy : target;
}
module.exports = exports['default'];

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj, prop) {
    if (!obj || !prop || !(prop in obj)) {
        return true;
    }

    var des = Object.getOwnPropertyDescriptor(obj, prop);
    return !des || des.configurable !== false;
};

module.exports = exports["default"];

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj) {
    return obj instanceof RegExp;
};

module.exports = exports["default"];

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj) {
    return typeof obj === 'string';
};

module.exports = exports['default'];

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj, prop) {
    if (!obj || !prop || !(prop in obj)) {
        return true;
    }

    var des = Object.getOwnPropertyDescriptor(obj, prop);
    return !des || des.writable !== false;
};

module.exports = exports["default"];

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(60);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__["a" /* default */])(value)
    : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__["a" /* default */])(value);
}

/* harmony default export */ __webpack_exports__["a"] = (baseGetTag);


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(14)))

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(61);


/** Built-in value references. */
var getPrototype = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__overArg_js__["a" /* default */])(Object.getPrototypeOf, Object);

/* harmony default export */ __webpack_exports__["a"] = (getPrototype);


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(28);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["a"] = (getRawTag);


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ __webpack_exports__["a"] = (objectToString);


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ __webpack_exports__["a"] = (overArg);


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(57);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["a"] = (root);


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ __webpack_exports__["a"] = (isObjectLike);


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = applyMiddleware;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(30);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_warning__ = __webpack_require__(32);




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_0__createStore__["b" /* ActionTypes */].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__["a" /* default */])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_0__createStore__["b" /* ActionTypes */].INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + __WEBPACK_IMPORTED_MODULE_0__createStore__["b" /* ActionTypes */].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (__webpack_require__.i({"VERSION":"0.1.0"}).NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  if (__webpack_require__.i({"VERSION":"0.1.0"}).NODE_ENV !== 'production') {
    var unexpectedKeyCache = {};
  }

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (__webpack_require__.i({"VERSION":"0.1.0"}).NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(68);


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(69);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(73)(module)))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(71);
var bytesToUuid = __webpack_require__(70);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(33);


/***/ })
/******/ ]);
});