import isEqualWith from 'lodash/isEqualWith';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import forEach from 'lodash/forEach';

import {
    hashCode
} from '../utils/hashCode';
import {
    isImmutableMap,
    isImmutableList,
    is
} from '../utils/lang';

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

// TODO 改进以下方法
function shallowMerge(oldState, newState, depth = 0) {
    if (depth++ > 0) {
        let target = hashCode(newState);
        let history = histories.get(target);
        if (history) {
            let options = history.get('options');

            if (options.independent) {
                return history.get('present');
            }
        }
    }

    // NOTE: Keep the same object no change.
    if (isArray(newState) || isImmutableList(newState)) {
        return newState.map(value => {
            var exist = oldState.find(o => is(o, value));

            return exist || value;
        });
    } else if (isPlainObject(newState)) {
        let state = {...newState};
        forEach(oldState, (value, key) => {
            if (!value || !state[key]) {
                return;
            }
            if (isArray(value) || isImmutableList(state)) {
                state[key] = shallowMerge(value, state[key], depth);
            } else if (is(value, state[key])) {
                state[key] = value;
            }
        });
        return state;
    } else if (isImmutableMap(newState)) {
        return newState.withMutations(temp => {
            oldState.forEach((value, key) => {
                if (!value || !temp.get(key)) {
                    return;
                }
                if (isArray(value) || isImmutableList(value)) {
                    temp.set(key, shallowMerge(value, temp.get(key), depth));
                } else if (is(hashCode(value), hashCode(temp.get(key)))) {
                    temp.set(key, value);
                }
            });
        });
    } else {
        return newState;
    }
}

function deepMerge(oldState, newState) {
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
    if (isUndoableState(state)) {
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
        return present === newState ? state : options.independent ? present.valueOf() : state;
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
// TODO Undoable内的其他model状态的变更也可通过history控制是否batch
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

    if (options.deep) {
        return deepMerge(state, present);
    } else {
        return shallowMerge(state, present);
    }
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

    if (options.deep) {
        return deepMerge(state, present);
    } else {
        return shallowMerge(state, present);
    }
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
