import isEqualWith from 'lodash/isEqualWith';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

import {
    hashCode
} from '../utils/hashCode';
import {
    isImmutableMap,
    isImmutableList,
    is
} from '../utils/lang';
import map from '../utils/map';

import isUndoableState, {IS_UNDOABLE_SENTINEL} from './isUndoableState';

function toJS(obj) {
    return obj && obj.toJS ? obj.toJS() : obj;
}

function toJSON(obj) {
    return obj && obj.toJSON ? obj.toJSON() : obj;
}

function deepEqualState(oldState, newState) {
    // NOTE: The reference will be changed
    // if some mutations happened in state,
    // so checking if reference is equal
    // or not is just enough.
    return oldState === newState;
}

function shallowEqualState(oldState, newState) {
    return isEqualWith(oldState, newState, (objVal, otherVal) => {
        if (isFunction(objVal) && isFunction(otherVal)) {
            return true;
        }
        // If both are array, compare every element,
        // otherwise compare value.
        else if (!isArray(objVal) || !isArray(otherVal)) {
            return is(objVal, otherVal);
        }
        // NOTE: Return undefined will continue to compare by `===` deeply.
    });
}

function isArrayLike(obj) {
    return isArray(obj) || isImmutableList(obj);
}

function isMapLike(obj) {
    return isPlainObject(obj) || isImmutableMap(obj);
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
    if (oldState === newState || !oldState) {
        return newState;
    }

    if (isArrayLike(oldState) && isArrayLike(newState)) {
        return map(newState, (value) => {
            // NOTE: Using owned `find` to fit Array and Immutable.List.
            var exist = oldState.find((oldValue) => is(oldValue, value));

            return exist || value;
        });
    } else if (isMapLike(oldState) && isMapLike(newState)) {
        return deep ? map(newState, (newValue, key) => {
            var oldValue = isPlainObject(oldState) ? oldState[key] : oldState.get(key);

            if (is(newValue, oldValue)) {
                return oldValue;
            } else {
                return shallowMerge(oldValue, newValue, false);
            }
        }) : oldState;
    } else {
        return newState;
    }
}

function deepMerge(oldState, newState) {
    if (!isUndoableState(newState) || oldState === newState) {
        return newState;
    }

    var state;
    // NOTE: 这里向状态树返回新的使用原始toJS的状态，
    // 从而保证undo/redo的model可返回到指定状态，
    // 也保证了其下级的undoable model可自管理，
    // 还保证了undo/redo的可重复性（因为历史数据没有发生改变）
    if (isImmutableMap(newState)) {
        state = newState.toMap();
    } else {
        state = {...newState};
    }
    delete state.toJS;
    delete state.toJSON;
    delete state.valueOf;
    delete state[IS_UNDOABLE_SENTINEL];

    return state;
}

function undoableState(state, options) {
    if (isUndoableState(state) || !options.independent) {
        return state;
    }

    var newState;
    if (isImmutableMap(state)) {
        newState = state.toMap();
    } else {
        newState = {...state};
    }

    newState[IS_UNDOABLE_SENTINEL] = true;
    newState.valueOf = function () {
        var target = hashCode(state);
        var present = histories[target].present;
        return present === newState ? state : present.valueOf();
    };
    newState.toJS = function () {
        return toJS(this.valueOf());
    };
    newState.toJSON = function () {
        return toJSON(this.valueOf());
    };

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
    var hash = hashCode(target);
    var history = histories[hash];

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
    var target = hashCode(state);
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
    var target = hashCode(state);
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
    var target = hashCode(action.$target);
    if (!target || !histories[target]
        || target !== hashCode(state)) {
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
    var target = hashCode(action.$target);
    if (!target || !histories[target]
        || target !== hashCode(state)) {
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
    var target = hashCode(action.$target);
    if (!target || !histories[target]
        || target !== hashCode(state)) {
        return state;
    }

    var history = histories[target];
    history.past = [];
    history.future = [];

    return state;
}

export function startBatch(state, action = {}) {
    var target = hashCode(action.$target);
    if (!target || !histories[target]
        || target !== hashCode(state)) {
        return state;
    }

    var history = histories[target];
    history.isBatching = true;

    return state;
}

export function endBatch(state, action = {}) {
    var target = hashCode(action.$target);
    if (!target || !histories[target]
        || target !== hashCode(state)) {
        return state;
    }

    var history = histories[target];
    history.isBatching = false;

    // Add the final state to history
    return insert(state, action);
}
