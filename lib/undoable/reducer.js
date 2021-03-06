'use strict';

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

var _immutableJs = require('immutable-js');

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