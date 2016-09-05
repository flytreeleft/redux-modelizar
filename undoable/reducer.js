import clone from 'lodash/clone';

import guid from '../utils/guid';

function deepEqualState(oldState, newState) {
    // NOTE: The reference will be changed
    // if some mutations happened in state,
    // so checking if reference is equal
    // or not is just enough.
    return oldState === newState;
}

function shallowEqualState(oldState, newState) {
    var excludes = ['valueOf'];
    var oldKeys = oldState.keys().filter((key) => excludes.indexOf(key) >= 0);
    var newKeys = newState.keys().filter((key) => excludes.indexOf(key) >= 0);
    if (oldKeys.length !== newKeys.length) {
        return false;
    }

    var equal = true;
    oldState.forEach((oldS, path) => {
        if (excludes.indexOf(path) >= 0) {
            return;
        }

        var newS = newState.get(path);
        if (oldS.isArray() && newS.isArray()
            && oldS.size() === newS.size()) {
            oldS.forEach((s, path) => {
                equal = s.same(newS.get(path));
                return equal;
            });
        } else {
            equal = oldS.same(newS);
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
function shallowMerge(oldState, newState, deep = true) {
    if (oldState === newState || !oldState
        || oldState.valueOf() === newState.valueOf()) {
        return newState;
    }

    if (oldState.isArray() && newState.isArray()) {
        return newState.map((state, path) => {
            // Find exist value by guid
            var exist = oldState.get(state.valueOf());

            return exist.valueOf() !== undefined ? exist : state;
        });
    } else if (oldState.isObject() && newState.isObject()) {
        return deep ? newState.map((state, path) => {
            var old = oldState.get(path);

            if (old.same(state)) {
                return old;
            } else {
                return shallowMerge(old, state, false);
            }
        }) : oldState;
    } else {
        return newState;
    }
}

function deepMerge(oldState, newState) {
    if (oldState === newState) {
        return newState;
    }

    var value = newState.valueOf();
    delete value.valueOf;

    return newState.set(value);
}

function undoableState(state, options) {
    if (!options.independent) {
        return state;
    }

    var newState;
    var value = state.valueOf();
    var newValue = clone(value);
    newValue.valueOf = function () {
        var target = guid(state);
        var present = histories[target].present;
        return present === newState ? value : present.valueOf();
    };

    newState = state.set(newValue);
    return newState;
}

// `{target: history}` map
// TODO Record `action.type`
var histories = {};

// 注意：不要直接修改传入对象！！！！

/**
 * Invoke this method at any time you need using `history`.
 */
export function getHistory(target) {
    var id = guid(target);
    var history = histories[id];

    return history ? {
        undoes: [].concat(history.past),
        redoes: [].concat(history.future),
        isBatching: history.isBatching
    } : null;
}

/**
 * @param {Object} state The state of model.
 */
export function init(state, action, options = {}) {
    var target = guid(action.$target);
    if (!target || histories[target]) {
        return state;
    }

    var present = undoableState(state, options);
    histories[target] = {
        future: [],
        present: present,
        past: [],
        isBatching: false,
        options: options
    };

    return present;
}

/**
 * @param {Object} state The state of model.
 */
export function insert(state, action) {
    var target = guid(state);
    if (!target || !histories[target]) {
        return state;
    }

    var history = histories[target];
    var options = history.options;
    var present = history.present;
    var equals = options.deep ? deepEqualState : shallowEqualState;
    if (equals(present, state)) {
        return state;
    }

    var hist = {
        future: [].concat(history.future),
        present: present,
        past: [].concat(history.past)
    };
    if (options.filter && !options.filter(action, state, hist)) {
        return state;
    }

    var isBatching = history.isBatching;
    if (isBatching) {
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

    return present;
}

export function undo(state, action = {}) {
    var target = guid(action.$target);
    if (!target || !histories[target]
        || !state.is(action.$target)) {
        return state;
    }

    var history = histories[target];
    var options = history.options;
    var present = history.present;
    var future = history.future;
    var past = history.past;
    var total = Math.max(1, action.total || 1);
    var index = past.length - Math.min(total, past.length);
    var undoes = [...past.slice(index), present];

    history.present = present = undoes.shift();
    history.future = [...undoes, ...future];
    history.past = index > 0 ? past.slice(0, index) : [];

    var merge = options.deep ? deepMerge : shallowMerge;
    return merge(state, present);
}

export function redo(state, action = {}) {
    var target = guid(action.$target);
    if (!target || !histories[target]
        || !state.is(action.$target)) {
        return state;
    }

    var history = histories[target];
    var options = history.options;
    var present = history.present;
    var past = history.past;
    var future = history.future;
    var total = Math.max(1, action.total || 1);
    var index = Math.min(total, future.length);
    var redoes = [present, ...future.slice(0, index)];

    history.present = present = redoes.pop();
    history.past = [...past, ...redoes];
    history.future = index < future.length ? future.slice(index) : [];

    var merge = options.deep ? deepMerge : shallowMerge;
    return merge(state, present);
}

export function clear(state, action = {}) {
    var target = guid(action.$target);
    if (!target || !histories[target]
        || !state.is(action.$target)) {
        return state;
    }

    var history = histories[target];
    history.past = [];
    history.future = [];

    return state;
}

export function startBatch(state, action = {}) {
    var target = guid(action.$target);
    if (!target || !histories[target]
        || !state.is(action.$target)) {
        return state;
    }

    var history = histories[target];
    history.isBatching = true;

    return state;
}

export function endBatch(state, action = {}) {
    var target = guid(action.$target);
    if (!target || !histories[target]
        || !state.is(action.$target)) {
        return state;
    }

    var history = histories[target];
    history.isBatching = false;

    // Add the final state to history
    return insert(state, action);
}
