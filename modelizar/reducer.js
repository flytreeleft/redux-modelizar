import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import cloneWith from 'lodash/cloneWith';

import {
    isImmutableMap,
    isImmutableList,
    equals
} from '../utils/lang';
import {
    getHashCode
} from '../utils/hashCode';

// TODO 维护全局映射表，用于快速判断是否需要更新state，以及覆盖目标位置state
function mutateForTarget(value, target) {
    if (equals(value, target) || getHashCode(value) === getHashCode(target)) {
        if (value !== target && (isImmutableList(value) || isImmutableMap(value))) {
            return value.constructor().mergeDeep(target);
        } else {
            return target;
        }
    }
    else if (isImmutableMap(value)) {
        return mutateImmutableMap(value, target);
    }
    else if (isImmutableList(value)) {
        return mutateImmutableList(value, target);
    }
    else if (isArray(value)) {
        return mutateArray(value, target);
    }
    else if (isPlainObject(value)) {
        return mutateObject(value, target);
    }
    else {
        return value;
    }
}

function mutateByMap(state, target) {
    var changed = false;
    var newState = state.map(value => {
        var newValue = mutateForTarget(value, target);
        changed = newValue !== value;

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

        var newValue = mutateForTarget(value, target);
        changed = newValue !== value;

        return newValue;
    });

    return changed ? newState : state;
}

export function mutate(state, action = {}, options = {}) {
    var target = action.state;

    return mutateForTarget(state, target);
}
