import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import cloneWith from 'lodash/cloneWith';

import {
    isImmutableMap,
    isImmutableList,
    is
} from '../utils/lang';

// TODO 维护全局映射表，用于快速判断是否需要更新state，以及覆盖目标位置state

function mutateByMap(state, target) {
    var changed = false;
    var newState = state.map(value => {
        var newValue = mutateTarget(value, target);
        !changed && (changed = newValue !== value);

        return newValue;
    });

    return changed ? newState : state;
}

function mutateImmutableMap(state, target) {
    return mutateByMap(state, target);
}

function mutateImmutableList(state, target) {
    return mutateByMap(state, target);
}

function mutateArray(state, target) {
    return mutateByMap(state, target);
}

function mutateObject(state, target) {
    var changed = false;
    var newState = cloneWith(state, value => {
        if (value === state) {
            return;
        }

        var newValue = mutateTarget(value, target);
        !changed && (changed = newValue !== value);

        return newValue;
    });

    return changed ? newState : state;
}

function mutateTarget(state, target) {
    if (is(state, target)) {
        if (state !== target && (isImmutableList(state) || isImmutableMap(state))) {
            return state.constructor().mergeDeep(target);
        } else {
            return target;
        }
    }
    else if (isImmutableMap(state)) {
        return mutateImmutableMap(state, target);
    }
    else if (isImmutableList(state)) {
        return mutateImmutableList(state, target);
    }
    else if (isArray(state)) {
        return mutateArray(state, target);
    }
    else if (isPlainObject(state)) {
        return mutateObject(state, target);
    }
    else {
        return state;
    }
}

export function mutation(state, action = {}) {
    var target = action.state;

    return mutateTarget(state, target);
}
