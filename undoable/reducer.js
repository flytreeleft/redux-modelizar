import Immutable from 'immutable';

import isEqualWith from 'lodash/isEqualWith';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import forEach from 'lodash/forEach';

import hashCode from '../utils/hashCode';
import {
    isImmutableMap
} from '../utils/lang';

import isUndoableState, {IS_UNDOABLE_SENTINEL} from './isUndoableState';

function toJS(obj) {
    return obj && obj.toJS ? obj.toJS() : obj;
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
            return Immutable.is(objVal, otherVal);
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
    if (isArray(newState) || Immutable.List.isList(newState)) {
        return newState.map(value => {
            var exist = oldState.find(o => Immutable.is(o, value));

            return exist || value;
        });
    } else if (isPlainObject(newState)) {
        let state = {...newState};
        forEach(oldState, (value, key) => {
            if (!value || !state[key]) {
                return;
            }
            if (isArray(value) || Immutable.List.isList(state)) {
                state[key] = shallowMerge(value, state[key], depth);
            } else if (Immutable.is(value, state[key])) {
                state[key] = value;
            }
        });
        return state;
    } else if (Immutable.Map.isMap(newState)) {
        return newState.withMutations(temp => {
            oldState.forEach((value, key) => {
                if (!value || !temp.get(key)) {
                    return;
                }
                if (isArray(value) || Immutable.List.isList(value)) {
                    temp.set(key, shallowMerge(value, temp.get(key), depth));
                } else if (Immutable.is(hashCode(value), hashCode(temp.get(key)))) {
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
    delete state.valueOf;
    delete state.toJS;
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
        var present = histories.get(target).get('present');
        return present === newState ? state : options.independent ? present.valueOf() : state;
    };
    // TODO override Immutable's function toXxx()
    newState.toJS = function () {
        return toJS(this.valueOf());
    };

    return newState;
}

// `{target: history}` map
// TODO Record `action.type`
// TODO Undoable内的其他model状态的变更也可通过history控制是否batch
// TODO 去除对Immutable的依赖，直接使用Object
var histories = Immutable.Map();

// 注意：不要直接修改传入对象！！！！

/**
 * Invoke this method at any time you need using `history`.
 */
export function getHistory(target) {
    var history = histories.get(hashCode(target));

    return history ? {
        undoes: history.get('past').toArray(),
        redoes: history.get('future').toArray(),
        isBatching: history.get('isBatching')
    } : null;
}

/**
 * @param {Object} state The state of model.
 */
export function init(state, action, options = {}) {
    var target = hashCode(state);
    if (!target || histories.has(target)) {
        return state;
    }

    var newState = undoableState(state, options);
    var history = Immutable.Map({
        future: Immutable.List(),
        present: newState,
        past: Immutable.List(),
        isBatching: false,
        options: options
    });

    histories = histories.set(target, history);

    return newState;
}

/**
 * @param {Object} state The state of model.
 */
export function insert(state, action) {
    var target = hashCode(state);
    if (!target || !histories.has(target)) {
        return state;
    }

    var history = histories.get(target);
    var options = history.get('options');
    var present = history.get('present');
    var equals = options.deep ? deepEqualState : shallowEqualState;
    if (equals(present, state)) {
        return state;
    }

    var hist = {
        future: history.get('future'),
        present: present,
        past: history.get('past')
    };
    if (options.filter && !options.filter(action, state, hist)) {
        return state;
    }

    var isBatching = history.get('isBatching');
    if (isBatching) {
        return state;
    }

    var newState = undoableState(state, options);
    histories = histories.update(target, history => {
        var past = history.get('past');
        var limit = options.limit;

        if (limit !== 0) {
            past = past.push(present);
            if (limit > 0 && past.size > limit) {
                past = past.slice(past.size - limit);
            }
        }
        return history.set('past', past)
                      .set('present', newState)
                      .update('future', future => future.clear());
    });

    return newState;
}

export function undo(state, action = {}) {
    var target = hashCode(action.$target);
    if (!target || !histories.has(target)
        || target !== hashCode(state)) {
        return state;
    }

    histories = histories.update(target, history => {
        var present = history.get('present');
        var past = history.get('past');
        var total = Math.max(1, action.total || 1);
        var index = past.size - Math.min(total, past.size);
        var undoes = past.slice(index).push(present);

        return history.set('present', undoes.first())
                      .update('future', future => undoes.shift().concat(future))
                      .update('past', past => {
                          return index > 0 ? past.slice(0, index) : past.clear();
                      });
    });

    var history = histories.get(target);
    var options = history.get('options');
    var present = history.get('present');
    if (options.deep) {
        return deepMerge(state, present);
    } else {
        return shallowMerge(state, present);
    }
}

export function redo(state, action = {}) {
    var target = hashCode(action.$target);
    if (!target || !histories.has(target)
        || target !== hashCode(state)) {
        return state;
    }

    histories = histories.update(target, history => {
        var present = history.get('present');
        var future = history.get('future');
        var total = Math.max(1, action.total || 1);
        var index = Math.min(total, future.size);
        var redoes = future.slice(0, index).unshift(present);

        return history.set('present', redoes.last())
                      .update('past', past => past.concat(redoes.pop()))
                      .update('future', future => {
                          return index < future.size
                              ? future.slice(index)
                              : future.clear();
                      });
    });

    var history = histories.get(target);
    var options = history.get('options');
    var present = history.get('present');
    if (options.deep) {
        return deepMerge(state, present);
    } else {
        return shallowMerge(state, present);
    }
}

export function clear(state, action = {}) {
    var target = hashCode(action.$target);
    if (!target || !histories.has(target)
        || target !== hashCode(state)) {
        return state;
    }

    histories = histories.update(target, history => {
        return history.update('future', future => future.clear())
                      .update('past', past => past.clear());
    });

    return state;
}

export function startBatch(state, action = {}) {
    var target = hashCode(action.$target);
    if (!target || !histories.has(target)
        || target !== hashCode(state)) {
        return state;
    }

    histories = histories.update(target, history => {
        return history.update('isBatching', true);
    });

    return state;
}

export function endBatch(state, action = {}) {
    var target = hashCode(action.$target);
    if (!target || !histories.has(target)
        || target !== hashCode(state)) {
        return state;
    }

    histories = histories.update(target, history => {
        return history.update('isBatching', false);
    });

    // Add the final state to history
    return insert(state, action);
}
